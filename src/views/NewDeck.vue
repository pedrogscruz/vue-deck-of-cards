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
			<NewDeckRotationCard />
			<NewDeckAddCard />
		</div>
		<center>
			<NewDeckSubmit />
		</center>
	</form>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import NewDeckAddCard from '../components/NewDeckAddCard.vue'
import NewDeckSubmit from '../components/NewDeckSubmit.vue'
import NewDeckRotationCard from '../components/NewDeckRotationCard.vue'
import VCardItem from '../components/VCardItem.vue'

export default {
	components: {
		NewDeckAddCard,
		NewDeckSubmit,
		NewDeckRotationCard,
		VCardItem,
	},
	setup(props, vm) {
		onMounted(() => {
			console.log('onMounted');
			vm.root.$store.commit('RESET_FORM');
		});

		const cards = ref(vm.root.$store.state.cards);

		const validateCardIsNotRepeated = (newText, index) => (
			!cards.value.some(({ text, repeated }, ndx) => newText === text && !repeated && index !== ndx)
		);

		const removeCard = (index) => {
			cards.value.splice(index, 1);
		};

		const onSubmit = async () => {
			const myPile = [{text: vm.root.$store.state.rotationCardText}, ...cards.value].map(({ text }) => text.slice(-2));
			const deckId = await vm.root.$store.dispatch('CREATE_NEW_DECK', myPile);
			vm.root.$options.router.push({ path: "/deck/" + deckId });
		};

		return {
			cards,
			removeCard,
			validateCardIsNotRepeated,
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
</style>