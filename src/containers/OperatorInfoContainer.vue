<template>
  <div class="container column">
    <operator-info-registry :operator="operator" />
    <div class="space" />
    <operator-info :title="'ADDRESS'" :content="operator.address" />
    <operator-info :title="'TOTAL DEPOSIT'" :content="operator.totalDeposit" :is-token="true" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import OperatorInfoRegistry from '@/components/OperatorInfoRegistry.vue';
import OperatorInfo from '@/components/OperatorInfo.vue';

export default {
  components: {
    'operator-info': OperatorInfo,
    'operator-info-registry': OperatorInfoRegistry,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
}

.container {
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  padding-bottom: 16px;
}

.space {
  flex: 1;
}
</style>
