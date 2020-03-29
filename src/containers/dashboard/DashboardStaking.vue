<template>
  <div class="dashboard-staking">
    <dashboard-header :title="'Staking'" :path="'staking'" />
    <text-viewer :title="'TOTAL REWARD'" :content="convertedTONFromWTON(userTotalReward)" :with-divider="true" />
    <text-viewer :title="'TOTAL STAKED TON'" :content="convertedTONFromWTON(userTotalStaked)" :with-divider="true" />
    <text-viewer :title="'TOTAL NOT WITHDRAWABLE TON'" :content="convertedTONFromWTON(userTotalNotWithdrawable)" :with-divider="true" />
    <text-viewer :title="'TOTAL WITHDRAWABLE TON'" :content="convertedTONFromWTON(userTotalWithdrawable)" :with-divider="false" />
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
      'userTotalReward',
      'userTotalStaked',
      'userTotalDeposit',
      'userTotalNotWithdrawable',
      'userTotalWithdrawable',
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
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-left: 8px;
}
</style>
