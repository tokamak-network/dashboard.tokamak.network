<template>
  <div class="stake-info-layout">
    <div
      v-for="operator in operatorsStaked"
      :key="operator.rootchain"
    >
      <stake-info-container :operator="operator" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import StakeInfoContainer from '@/containers/StakeInfoContainer.vue';

export default {
  components: {
    'stake-info-container': StakeInfoContainer,
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
  },
};
</script>

<style scoped>
.stake-info-layout {
  margin-top: -8px;
}
</style>
