<template>
  <div class="row">
    <operator-info-container class="left-container" :operator="operator" />
    <delegate-manager-container class="right-container" :operator="operator" @refresh="refreshOperator" />
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
.row {
  display: flex;
  flex-direction: row;
}

.left-container {
  flex: 1;
  margin-right: 4px;
}

.right-container {
  flex: 1;
  margin-left: 4px;
}
</style>
