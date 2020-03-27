<template>
  <div class="delegations-container">
    <h4>Staking</h4>
    <text-viewer :title="'Total Staked TON'" :content="convertedTONFromWTON(userTotalStaked)" />
    <text-viewer :title="'Total Reward TON'" :content="convertedTONFromWTON(userTotalReward)" />
    <text-viewer :title="'Total Not Withdrawable TON'" :content="convertedTONFromWTON(userTotalNotWithdrawable)" />
    <text-viewer :title="'Total Withdrawable TON'" :content="convertedTONFromWTON(userTotalWithdrawable)" />
  </div>
</template>

<script>
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState, mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.vue';
// import StakedOperatorTable from '@/components/table/StakedOperatorTable.vue';

export default {
  components: {
    'text-viewer': TextViewer,
    // 'staked-operator-table': StakedOperatorTable,
  },
  computed: {
    ...mapGetters([
      'userTotalReward',
      // 'userTotalDeposit',
      'userTotalStaked',
      'userTotalNotWithdrawable',
      'userTotalWithdrawable',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
    // userTotalDepositWithPendingAndRequestable () {
    //   return this.userTotalDeposit.sub(this.userTotalNotWithdrawable).sub(this.userTotalWithdrawable);
    // },
  },
};
</script>

<style scoped>
h4 {
  padding: 0;
  margin: 0;
}
</style>
