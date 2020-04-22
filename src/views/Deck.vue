<template>
	<div class="container">
		<VLabel>Pile:</VLabel>
		<center>
			<span v-if="pile.length>0" :style="{ border: '4px dashed white', display: 'inline-block' }">
				<span
					v-for="(card, index) in pile"
					:key="index"
					:style="{ margin: '10px', display: 'inline-block' }"
				>
					<VCard v-bind:text="card"/>
				</span>
			</span>
		</center>
		<div class="high-card">
			<VLabel>Rotation Card: {{ rotationCard }}</VLabel>
		</div>
		<div class="high-card">
			<VLabel>High Card: {{ pile[0] }}</VLabel>
		</div>
		<div>
			<VLabel>Full House Combinations:</VLabel>
			<span v-if="fullHouse.length>0">
				<div v-for="(full, i) in fullHouse" :key="i" class="full-house">
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
</template>

<script>
import { onMounted, ref } from '@vue/composition-api'

import { values, suits } from '../utils/card'
import VCard from '../components/VCard.vue'
import VLabel from '../components/VLabel'

const kCombinations = (set, k) => {
  if (k > set.length || k <= 0)
    return []
  if (k == set.length)
    return [set]
  if (k == 1)
    return set.reduce((acc, cur) => [...acc, [cur]], [])
  
  const combs = [];
	let tailCombs = [];
  
  for (let i = 0; i <= set.length - k + 1; i++) {
    tailCombs = kCombinations(set.slice(i + 1), k - 1)
    for (let j = 0; j < tailCombs.length; j++) {
      combs.push([set[i], ...tailCombs[j]])
    }
  }
  
  return combs
};

const combinations = set => {
  return set.reduce((acc, cur, idx) => [...acc, ...kCombinations(set, idx + 1)], [])
};

export default {
	components: {
		VCard,
		VLabel
	},
	setup(props, vm) {
		const pile = ref([]);
		const fullHouse = ref([]);
		const rotationCard = ref('');

		const orderPile = (newPile) => {
			newPile = newPile.map(({ value, suit }) => ({
				value: isNaN(value)?value[0]:value,
				suit: suit[0]
			}));
			const suitsKeys = Object.keys(suits);
			const suitIndex = suitsKeys.indexOf(rotationCard.value.slice(-1));
			const suitsOrder = [...suitsKeys.slice(suitIndex), ...suitsKeys.slice(0, suitIndex)];
			const valueIndex = values.indexOf(rotationCard.value.slice(0,-1));
			const valuesOrder = [...values.slice(valueIndex), ...values.slice(0, valueIndex)];
			const repeatedValue = {};
			pile.value = newPile
				.sort((a1, a2) => {
					const suitWeight1 = suitsOrder.indexOf(a1.suit);
					const suitWeight2 = suitsOrder.indexOf(a2.suit);
					if (suitWeight1<suitWeight2) return -1;
					if (suitWeight1>suitWeight2) return 1;
					const valueWeight1 = valuesOrder.indexOf(a1.value);
					const valueWeight2 = valuesOrder.indexOf(a2.value);
					if (valueWeight1<valueWeight2) return -1;
					if (valueWeight1>valueWeight2) return 1;
					return 0;
				})
				.map(({ value, suit }) => {
					repeatedValue[value]?
						repeatedValue[value].add(suit)
					:
						(repeatedValue[value] = new Set([suit]))
					return value+suit;
				});
			const suitCombinations = {two: {}, three: {}};
			for (const [value, stsProp] of Object.entries(repeatedValue)) {
				const sts = Array.from(stsProp);
				if (sts.length>=2) {
					const comb = combinations(sts);
					suitCombinations.two[value] = comb
						.filter((cmbntn) => cmbntn.length === 2)
					if (sts.length>=3)
						suitCombinations.three[value] = comb
							.filter((cmbntn) => cmbntn.length === 3)
				}
			}
			const allCombinations = [];
			for (const [value2, comb2] of Object.entries(suitCombinations.two))
				for (const [value3, comb3] of Object.entries(suitCombinations.three))
					if (value2 !== value3)
						for (const cmb3 of comb3)
							for (const cmb2 of comb2)
								allCombinations.push([...cmb3.map((i) => value3+i), ...cmb2.map((i) => value2+i)]);
			fullHouse.value = allCombinations;
		};

		const formatCard = ({ code }) => (code[0]==='0'?'1':'') + code;

		onMounted(async () => {
			const deckPileUri = `https://deckofcardsapi.com/api/deck/${vm.root.$route.params.id}/pile/`;
			fetch(deckPileUri+`my_pile/list/`)
				.then(response => response.json())
				.then(result => {
					if (!result.piles.my_pile?.cards) return;
					rotationCard.value = formatCard(result.piles.my_pile.cards[0]);
					orderPile(result.piles.my_pile.cards.slice(1));
				});
		});
		return {
			pile,
			fullHouse,
			rotationCard
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