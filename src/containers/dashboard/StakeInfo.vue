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
      <div
        v-for="operator in operatorsStaked"
        :key="operator.rootchain"
      >
        <simple-stake-info :operator="operator" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SimpleStakeInfo from '@/components/SimpleStakeInfo.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    'simple-stake-info': SimpleStakeInfo,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
  },
};
</script>

<style scoped>
</style>
