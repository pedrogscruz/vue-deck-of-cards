<template>
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
</template>

<script>
import { ref, computed, watchEffect } from '@vue/composition-api'
import VCard from '../components/VCard.vue'
import VInput from '../components/VInput'
import VLabel from '../components/VLabel'

export default {
	components: {
		VCard,
		VInput,
		VLabel
	},
	setup(props, vm) {
		const rotationCard = ref('');
		const rotationCardIsValid = ref(false);

		const rotationCardError = computed(() => (
			!rotationCardIsValid.value && 'Unknown Card'
		));

		watchEffect(() => {
			vm.root.$store.commit('SET_ROTATION_CARD_VALID', rotationCardIsValid.value);
		});
		watchEffect(() => {
			vm.root.$store.commit('SET_ROTATION_CARD_TEXT', rotationCard.value);
		});

		return {
			rotationCard,
			rotationCardIsValid,
			rotationCardError,
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