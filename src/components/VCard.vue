<template>
	<div class="card" :class="!!error && 'error'">
		<span class="suit left">
			{{ formattedCard }}
		</span>
		<span class="suit rotate right">
			{{ formattedCard }}
		</span>
		<span
			class="error-text"
			v-if="!!error"
		>
			{{ error }}
		</span>
		<VCloseButton
			v-if="$listeners.remove"
			type="button"
			class="close-button"
			v-on:click="$emit('remove', $event)"
		/>
	</div>
</template>

<script>
import { computed, watchEffect } from '@vue/composition-api'
import VCloseButton from '../components/VCloseButton'

export const values = ['2','A','K','Q','J','10','9','8','7','6','5','4','3'];
export const suits = {H: '❤️', D: '♦️', C: '♣️', S: '♠️'};

export const formatValue = (string) => {
	if (![2, 3].includes(string.length)) return '';
	let value = Array.from(string.toUpperCase());
	let suit = value.splice(-1);
	value = value.join('');
	if (!values.includes(value)) return '';
	suit = suits[suit[0]];
	if (!suit) return '';
	return value+suit;
};

export default {
	props: {
		text: {
			type: String,
			required: true
		},
		error: {
			type: [String, Boolean],
			required: false
		}
	},
	components: {
		VCloseButton
	},
	setup(props, { emit }) {
		const { text } = props;
		const formattedCard = computed(() => formatValue(text) || '?');

		const isValid = computed(() => formattedCard.value !== '?');

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
	.card {
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		border-radius: 4px;
		padding: 6px;
		height: 100px;
		width: 60px;
		position: relative;
		border: 2px dashed transparent;
	}
	.error {
		border: 2px dashed red;
	}
	.error-text {
		font-size: 12px;
		color: red
	}
	.rotate {
		display: block;
		transform: rotate(180deg);
	}
	.suit {
		font-weight: bold;
		letter-spacing: 3px;
		position: absolute;
	}
	.left {
		top: 6px;
		left: 6px;
	}
	.right {
		bottom: 6px;
		right: 6px;
	}
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		opacity: 0;
		transition: opacity 0.1s ease-in;
	}
	.card:hover > .close-button {
		opacity: 1;
	}
</style>