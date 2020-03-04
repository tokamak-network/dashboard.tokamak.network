<template>
  <div style="display: flex;">
    <operator-info-container
      :operator="operator"
      style="flex: 1; margin-right: 4px;"
    />
    <delegate-manager
      style="flex: 1; margin-left: 4px;"
      :operator="operator"
      v-on:refresh="refreshOperator"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import DelegateManager from '@/components/DelegateManager.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

export default {
  components: {
    'delegate-manager': DelegateManager,
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
.operator-info-layout {
  height: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
.operator-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 16px;
  margin-right: 16px;
}

.operator-info-image {
  margin-left: 16px;
  margin-right: 16px;
  width: 65px;
  height: 65px;
}

.operator-name-label {
  font-family: Roboto;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
}

.operator-info-label {
  width: 60px;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  color: #586064;
}

.operator-info-content {
  flex: 1;
  word-break: break-all;
  padding-right: 24px;
  font-size: 12px;
  font-weight: 200;
  text-align: left;
  color: #586064;
}

.operator-info-detailed-label {
  flex: 1;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #676767;
  padding-left: 20px;
}

.operator-info-detailed-content {
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #586064;
  padding-right: 20px;
}

.operator-info-detailed-container {
  width: 100%;
}

.operator-info-detailed {
  display: flex;
  align-items: center;
  height: 36px;
  border-top: solid 0.7px #ced6d9;
}
</style>
