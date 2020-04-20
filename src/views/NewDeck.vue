<template>
	<form novalidate @submit.prevent="onSubmit">
		<div>
			<span
				v-for="(card, index) in cards"
				:key="index"
			>
				<VCard
					v-bind:card="card"
					v-on:input="card.text = $event; card.repeated = !validateCardIsNotRepeated(card.text, index);"
					v-on:validate="card.valid = $event"
				/>
				<span v-if="!card.valid">Não válido</span>
				<span v-else-if="card.repeated">Repetido</span>
			</span>
		</div>
		<div>
			<input type="text" maxlength="2" v-model="newCard" />
			<button
				@click="addNewCard"
				:disabled="!newCardIsValid"
			>
				add
			</button>
		</div>
		<div>
			<button
				type="submit"
				:disabled="!isValid"
			>
				submit
			</button>
		</div>
	</form>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import VCard, { formatValue } from '../components/VCard.vue'

export default {
	components: {
		VCard
	},
	setup() {
		const cards = ref([]);
		const newCard = ref('');

		const validateCardIsNotRepeated = (newText, index) => (
			!cards.value.some(({ text }, ndx) => newText === text && index !== ndx)
		);
		
		const addNewCard = () => {
			cards.value.push({ text: newCard.value, valid: true, repeated: false });
			newCard.value = '';
		};

		const isValid = computed(() => (
			cards.value.length>0 && !cards.value.some(({ valid }) => !valid)
		));

		const newCardIsValid = computed(() => (
			formatValue(newCard.value) !== '' && validateCardIsNotRepeated(newCard.value)
		));

		const onSubmit = () => {
			console.log('submit');
		};

		return {
			cards,
			newCard,
			addNewCard,
			newCardIsValid,
			validateCardIsNotRepeated,
			isValid,
			onSubmit
		};
	}
}
</script>

<style scoped>
	.asda {
		margin: 0;
	}
</style>