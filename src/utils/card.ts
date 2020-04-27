import { pile, card } from '../store/types';

export const values = ['2','A','K','Q','J','10','9','8','7','6','5','4','3'];
export const suits = {H: '❤️', D: '♦️', C: '♣️', S: '♠️'};

const formatCard = ({ code }: pile) => (code[0] === '0' ? '1' : '') + code;
const formatPile: (pile: pile[]) => card[] = (pile: card[]) => pile.map(({ value, suit }) => ({
	value: isNaN(value as any) ? value[0] : value,
	suit: suit[0]
}));

const kCombinations: (set: any[], k: number) => any[][] = (set, k) => {
	if (k > set.length || k <= 0)
		return [];
	if (k == set.length)
		return [set];
	if (k == 1)
		return set.reduce((acc, cur) => [...acc, [cur]], []);
	const combs = [];
	let tailCombs = [];
	for (let i = 0; i <= set.length - k + 1; i++) {
		tailCombs = kCombinations(set.slice(i + 1), k - 1)
		for (let j = 0; j < tailCombs.length; j++)
			combs.push([set[i], ...tailCombs[j]]);
	}
	return combs;
};
const combinations: (set: any[]) => any[][] = (set: any[]) => {
	return set.reduce((acc, cur, idx) => [...acc, ...kCombinations(set, idx + 1)], [])
};

type sc = { [key: string]: any[][] };
type suitCombinations = { two: sc; three: sc };

export const getDeck = (pile: pile[]) => {
	const rotationCard = formatCard(pile[0]);
	const newPile = formatPile(pile.slice(1));
	const suitsKeys = Object.keys(suits);
	const suitIndex = suitsKeys.indexOf(rotationCard.slice(-1));
	const suitsOrder = [...suitsKeys.slice(suitIndex), ...suitsKeys.slice(0, suitIndex)];
	const valueIndex = values.indexOf(rotationCard.slice(0, -1));
	const valuesOrder = [...values.slice(valueIndex), ...values.slice(0, valueIndex)];
	const repeatedValue: {[key: string]: Set<string>} = {};
	const cards = newPile
		.sort((a1, a2) => {
			const suitWeight1 = suitsOrder.indexOf(a1.suit);
			const suitWeight2 = suitsOrder.indexOf(a2.suit);
			if (suitWeight1 < suitWeight2) return -1;
			if (suitWeight1 > suitWeight2) return 1;
			const valueWeight1 = valuesOrder.indexOf(a1.value);
			const valueWeight2 = valuesOrder.indexOf(a2.value);
			if (valueWeight1 < valueWeight2) return -1;
			if (valueWeight1 > valueWeight2) return 1;
			return 0;
		})
		.map(({ value, suit }) => {
			repeatedValue[value] ?
				repeatedValue[value].add(suit)
			:
				(repeatedValue[value] = new Set([suit]))
			return value + suit;
		});
	const suitCombinations: suitCombinations = { two: {}, three: {} };
	for (const [value, stsProp] of Object.entries(repeatedValue)) {
		const sts = Array.from(stsProp);
		if (sts.length >= 2) {
			const comb = combinations(sts);
			suitCombinations.two[value] = comb
				.filter((cmbntn) => cmbntn.length === 2)
			if (sts.length >= 3)
				suitCombinations.three[value] = comb
					.filter((cmbntn) => cmbntn.length === 3)
		}
	}
	const fullHouse = [];
	for (const [value2, comb2] of Object.entries(suitCombinations.two))
		for (const [value3, comb3] of Object.entries(suitCombinations.three))
			if (value2 !== value3)
				for (const cmb3 of comb3)
					for (const cmb2 of comb2)
						fullHouse.push([...cmb3.map((i) => value3 + i), ...cmb2.map((i) => value2 + i)]);
	return { cards, fullHouse, rotationCard };
};