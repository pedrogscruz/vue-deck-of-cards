<template>
	<form novalidate @submit.prevent="onSubmit">
		<div class="deck">
			<div class="scroll">
				<VCardItem
					:id="'card.'+index"
					v-for="(card, index) in cards"
					:key="index"
					v-bind:card="card"
					v-on:input="card.text = $event; card.repeated = !validateCardIsNotRepeated(card.text, index);"
					v-on:validate="card.valid = $event"
					v-on:remove="removeCard(index)"
				/>
			</div>
		</div>
		<div :style="{ display: 'flex', padding: '20px' }">
			<div>
				<div :style="{ display: 'flex'}">
					<VLabel>Rotation Card: </VLabel>
					<VInput
						id="rotation-card-input"
						class="input"
						type="text"
						maxlength="3"
						v-model="rotationCard"
						v-on:keydown.enter.prevent
					/>
				</div>
				<VCard
					:key="rotationCard"
					:text="rotationCard"
					:error="rotationCardError"
					v-on:validate="rotationCardIsValid = $event"
				/>
			</div>
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
		</div>
		<center>
			<VButton
				type="submit"
				primary
				:disabled="!isValid"
			>
				submit
			</VButton>
		</center>
	</form>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import VCardItem from '../components/VCardItem.vue'
import VCard, { formatValue } from '../components/VCard.vue'
import VButton from '../components/VButton'
import VInput from '../components/VInput'
import VLabel from '../components/VLabel'

export default {
	components: {
		VCardItem,
		VCard,
		VButton,
		VInput,
		VLabel
	},
	setup(props, vm) {
		const cards = ref([]);
		const newCard = ref('');
		const rotationCard = ref('');
		const rotationCardIsValid = ref(false);

		const validateCardIsNotRepeated = (newText, index) => (
			!cards.value.some(({ text, repeated }, ndx) => newText === text && !repeated && index !== ndx)
		);

		const validateThisCardIsNotRepeated = (newText) => (
			!cards.value.some(({ text }) => newText === text)
		);

		const rotationCardError = computed(() => (
			!rotationCardIsValid.value && 'Unknown Card'
		));

		const isValid = computed(() => {
			const textsSet = new Set();
			return (
				cards.value.length>0 && !rotationCardError.value && !cards.value.some(({ valid, text }) => {
					const repeat = textsSet.has(text);
					textsSet.add(text);
					return !valid || repeat;
				})
			);
		});

		const newCardIsValid = computed(() => (
			formatValue(newCard.value) !== '' && validateThisCardIsNotRepeated(newCard.value)
		));

		const addNewCard = () => {
			if (!newCardIsValid.value || cards.value.length === 10) return;
			cards.value.push({ text: newCard.value, valid: true, repeated: false });
			newCard.value = '';
		};

		const removeCard = (index) => {
			cards.value.splice(index, 1);
		};

		const onSubmit = async () => {
			const myPile = [{text: rotationCard.value}, ...cards.value].map(({ text }) => text.slice(-2));
			const deckId = await vm.root.$store.dispatch('CREATE_NEW_DECK', myPile);
			vm.root.$options.router.push({ path: "/deck/" + deckId });
		};

		return {
			cards,
			newCard,
			rotationCard,
			addNewCard,
			removeCard,
			newCardIsValid,
			validateCardIsNotRepeated,
			isValid,
			rotationCardIsValid,
			rotationCardError,
			onSubmit
		};
	}
}
</script>

<style scoped>
	.deck {
		background:
			radial-gradient(#63c763 15%, transparent 16%) 0 0,
			radial-gradient(#63c763 15%, transparent 16%) 8px 8px,
			radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,
			radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;
		background-color: #4aad4a;
		background-size:16px 16px;
		border: 15px solid #a95555;
		border-radius: 150px;
		position: relative;
		padding: 20px;
		height: 386px;
		overflow: auto;
	}
	.deck:before {
    content: '';
    border: 7px solid rgba(0, 0, 0, 0.1);
    display: block;
    border-radius: 135px;
		position: absolute;
		pointer-events: none;
		z-index: 1;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.scroll {
		padding: 35px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
	}
	.input {
		width: 70px;
		margin-right: 10px;
	}
</style>