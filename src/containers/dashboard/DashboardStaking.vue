<template>
  <div class="dashboard-staking">
    <dashboard-header :title="'Staking'" :path="'staking'" />
    <text-viewer :title="'Total Reward'" :content="currencyAmount(userTotalReward)" :with-divider="true" />
    <text-viewer :title="'Total Staked MTON'" :content="currencyAmount(userTotalStaked)" :with-divider="false" />
    <text-viewer :title="'Total Not Withdrawable MTON'" :content="currencyAmount(userTotalNotWithdrawable)" :with-divider="false" />
    <text-viewer :title="'Total Withdrawable MTON'" :content="currencyAmount(userTotalWithdrawable)" :with-divider="false" />
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
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
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
      this.$router.push({
        path: `/operators/${rootchain.toLowerCase()}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
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
