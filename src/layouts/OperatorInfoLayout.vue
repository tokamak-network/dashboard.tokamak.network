<template>
  <div class="column">
    <operator-info-container
      :operator="operator"
      style="flex: 1; margin-right: 4px;"
    />
    <delegate-manager-container
      :operator="operator"
      style="flex: 1; margin-left: 4px;"
      @refresh="refreshOperator"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import DelegateManagerContainer from '@/containers/DelegateManagerContainer.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

export default {
  components: {
    'delegate-manager-container': DelegateManagerContainer,
    'operator-info-container': OperatorInfoContainer,
  },
  data () {
    return {
      operator: {},
    };
  },
  computed: {
    ...mapGetters([
      'operatorByRootchain',
    ]),
  },
  created () {
    this.param = this.$route.params.rootchain;
    this.refreshOperator();
  },
  methods: {
    refreshOperator () {
      this.operator = this.operatorByRootchain(this.param);
    },
    calculateReward () {
      try {
        return (this.operator.totalStake.div(this.operator.totalDeposit)).toNumber();
      } catch (e) {
        return 0;
      }
    },
  },
};
</script>

<style scoped>
.column{
  display: flex;
}
</style>
