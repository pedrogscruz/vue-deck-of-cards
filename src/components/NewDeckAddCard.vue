<template>
	<div :style="{marginLeft: 'auto'}">
		<VLabel>Add Card: </VLabel>
		<VInput
			id="add-card-input"
			class="input"
			type="text"
			maxlength="3"
			v-model="newCard"
			v-on:keydown.enter.prevent="addNewCard"
		/>
		<VButton
			id="add-card-button"
			type="button"
			@click="addNewCard"
			:disabled="!newCardIsValid"
		>
			add
		</VButton>
	</div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import { formatValue } from '../components/VCard.vue'
import VButton from '../components/VButton'
import VInput from '../components/VInput'
import VLabel from '../components/VLabel'

export default {
	components: {
		VButton,
		VInput,
		VLabel
	},
	setup(props, vm) {
		const newCard = ref('');

		const newCardIsValid = computed(() => (
			formatValue(newCard.value) !== '' &&
			!vm.root.$store.state.cards.some(({ text }) => newCard.value === text)
		));

		const addNewCard = () => {
			const cards = vm.root.$store.state.cards;
			if (!newCardIsValid.value || cards.length === 10) return;
			cards.push({ text: newCard.value, valid: true, repeated: false });
			newCard.value = '';
		};

		return {
			newCard,
			addNewCard,
			newCardIsValid
		};
	}
}
</script>

<style scoped>
	.input {
		width: 70px;
		margin-right: 10px;
	}
</style>