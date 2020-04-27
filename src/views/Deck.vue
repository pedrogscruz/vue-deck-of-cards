<template>
	<div class="container">
		<VLabel v-if="deckPile === true">Loading ...</VLabel>
		<VLabel v-else-if="deckPile === false">Not found 404</VLabel>
		<div v-else>
			<VLabel>Pile:</VLabel>
			<center>
				<span v-if="deckPile.cards.length>0" :style="{ border: '4px dashed white', display: 'inline-block' }">
					<span
						v-for="(card, index) in deckPile.cards"
						:key="index"
						:style="{ margin: '10px', display: 'inline-block' }"
					>
						<VCard v-bind:text="card"/>
					</span>
				</span>
			</center>
			<div class="high-card">
				<VLabel>Rotation Card: {{ deckPile.rotationCard }}</VLabel>
			</div>
			<div class="high-card">
				<VLabel>High Card: {{ deckPile.cards[0] }}</VLabel>
			</div>
			<div>
				<VLabel>Full House Combinations:</VLabel>
				<span v-if="deckPile.fullHouse.length>0">
					<div v-for="(full, i) in deckPile.fullHouse" :key="i" class="full-house">
						<VLabel :style="{ marginRight: '10px' }">{{ i+1 }}.</VLabel>
						<span
							v-for="(house, j) in full"
							:key="i+'.'+j"
							:style="{ margin: '10px', display: 'inline-block' }"
						>
							<VCard v-bind:text="house"/>
						</span>
					</div>
				</span>
				<VLabel v-else>None</VLabel>
			</div>
		</div>
	</div>
</template>

<script>
import { onMounted, computed } from '@vue/composition-api'

import VCard from '../components/VCard.vue'
import VLabel from '../components/VLabel'

export default {
	components: {
		VCard,
		VLabel
	},
	setup(props, vm) {
		const deckPile = computed(() => (
			vm.root.$store.getters.deck
		));

		onMounted(async () => {
			vm.root.$store.dispatch('GET_DECK', vm.root.$route.params.id);
		});

		return {
			deckPile
		};
	}
}
</script>

<style scoped>
	.container {
		max-width: 650px;
		margin: auto;
	}
	.high-card {
		margin-top: 20px;
		margin-bottom: 20px;
	}
	.full-house {
		display: inline-flex;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
	}
</style>