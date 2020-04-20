<template>
	
	<span class="container">
		<span>
			{{ formattedCard }}
		</span>
	</span>
	<input
		type="text"
		maxlength="2"
		v-bind:value="card.text"
		v-on:input="$emit('input', $event.target.value)"
	/>
</template>

<script>
import { computed, watchEffect } from '@vue/composition-api'

const values = ['2','A','K','Q','J','10','9','8','7','6','5','4','3'];
const suits = {H: '❤️', D: '♦️', C: '♣️', S: '♠️'};

export const formatValue = (value) => {
	const text = value.toUpperCase();
	if (text.length !== 2) return '';
	if (!values.includes(text[0])) return '';
	const suit = suits[text[1]];
	if (!suit) return '';
	return text[0]+suit;
};

export default {
	props: {
		card: {
			type: Object,
			required: true
		}
	},
	setup(props, { emit }) {
		const { card } = props;
		const formattedCard = computed(() => formatValue(card.text));

		const isValid = computed(() => formattedCard.value !== '');

		watchEffect(() => {
			emit('validate', isValid.value);
		});

		return {
			formattedCard
		};
	}
}
</script>

<style scoped>
	.container {
		margin: 0;
	} 
</style>