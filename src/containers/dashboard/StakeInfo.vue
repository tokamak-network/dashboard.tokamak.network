<template>
  <div>
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <div
      v-else
      class="simple-stake-info-container"
    >
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
      <simple-stake-info />
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js';

import SimpleStakeInfo from '@/components/SimpleStakeInfo.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    'simple-stake-info': SimpleStakeInfo,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: true,
    };
  },
  async beforeCreate () {
    const res = await api.sample();
    await new Promise(r => setTimeout(r, 2500));
    this.isLoading = false;
  },
};
</script>

<style>
</style>
