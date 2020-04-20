<template>
	<div class="container">
		<VCard
			:key="card.text"
			:error="showError"
			:text="card.text"
			v-on:validate="$emit('validate', $event)"
		/>
		<center>
			<input
				type="text"
				maxlength="3"
				class="input"
				v-bind:value="card.text"
				v-on:input="$emit('input', $event.target.value)"
				v-on:keydown.enter.prevent
			/>
		</center>
	</div>
</template>

<script>
import { computed } from '@vue/composition-api'
import VCard from './VCard.vue'

export default {
	props: {
		card: {
			type: Object,
			required: true
		}
	},
	components: {
		VCard
	},
	setup(props) {
		const { card } = props;

		const showError = computed(() => (
			!card.valid ? 'Unknown Card' : card.repeated && 'Repeated Card'
		));

		return {
			showError
		};
	}
}
</script>

<style scoped>
	.container {
		display: inline-block;
		margin: 15px;
	}
	.input {
		color: white;
		font-size: 20px;
		font-weight: bold;
		margin-top: 5px;
		width: 60px;
		text-align: center;
		background-color: transparent;
		border: 1px solid transparent;
		border-radius: 3px;
	}
	input:hover:not(:focus) {
		border: 1px solid #cccccc;
		cursor: pointer;
	}
	input:focus {
		background-color: white;
		color: black;
	}
</style>