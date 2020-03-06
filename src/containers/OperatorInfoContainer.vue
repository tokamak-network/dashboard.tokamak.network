<template>
  <div class="container column">
    <operator-info-registry :registry="operator.registry" />
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
  methods: {
    calculateReward () {
      try {
        return (this.operator.totalStake.div(this.operator.totalDeposit)).toNumber();
      } catch (e) {
        return 0;
      }
    },
    edit () {
      const path = this.$route.path;
      this.$router.push(`${path}/edit`);
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
}
</style>
