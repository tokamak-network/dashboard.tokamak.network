<template>
  <div class="dashboard-staking">
    <dashboard-header :title="'STAKING'" :path="'staking'" />
    <text-viewer :title="'STAKED TON'" :content="convertedTONFromWTON(userTotalStake)" />
    <div class="space" />
    <text-viewer :title="'EXPECTED REWARD'" :content="convertedTONFromWTON(userTotalReward)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'text-viewer': TextViewer,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: {
    ...mapGetters([
      'userTotalStake',
      'userTotalReward',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
  },
  created () {
    this.columns = [
      {
        name: 'OPERATOR',
        key: 'name',
      },
      {
        name: 'MY STAKE',
        key: 'userStake',
      },
    ];
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
.dashboard-staking {
  flex: 4;
  min-height: 314px;
  max-height: 314px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-left: 8px;
}

.space {
  flex: 1;
}
</style>
