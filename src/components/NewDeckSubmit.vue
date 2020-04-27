<template>
	<VButton
		type="submit"
		primary
		:disabled="!isValid"
	>
		submit
	</VButton>
</template>

<script>
import { computed } from '@vue/composition-api'
import VButton from '../components/VButton'

export default {
	components: {
		VButton
	},
	setup(props, vm) {

		const isValid = computed(() => {
			const textsSet = new Set();
			const cards = vm.root.$store.state.cards;
			const rotationCardValid = vm.root.$store.state.rotationCardValid;
			return (
				cards.length>0 && rotationCardValid && !cards.some(({ valid, text }) => {
					const repeat = textsSet.has(text);
					textsSet.add(text);
					return !valid || repeat;
				})
			);
		});

		return {
			isValid
		};
	}
}
</script>