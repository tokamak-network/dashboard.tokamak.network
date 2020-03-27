<template>
  <div class="stake-info-container">
    <text-viewer :title="'Total Staked TON'" :content="convertedTONFromWTON(userTotalStaked)" :withDivider="true" />
    <text-viewer :title="'Total Reward TON'" :content="convertedTONFromWTON(userTotalReward)" :withDivider="true" />
    <!-- <div class="space" /> -->
    <text-viewer :title="'Total Not Withdrawable TON'" :content="convertedTONFromWTON(userTotalNotWithdrawable)" :withDivider="true" />
    <text-viewer :title="'Total Withdrawable TON'" :content="convertedTONFromWTON(userTotalWithdrawable)" :withDivider="false" />
  </div>
</template>

<script>
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState, mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters([
      'userTotalReward',
      'userTotalStaked',
      'userTotalNotWithdrawable',
      'userTotalWithdrawable',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
    userTotalDepositWithPendingAndRequestable () {
      return this.userTotalDeposit.sub(this.userTotalNotWithdrawable).sub(this.userTotalWithdrawable);
    },
  },
};
</script>

<style scoped>
.stake-info-container {
  flex: 1;

  display: flex;
  flex-direction: column;

  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;

  margin-right: 4px;
}

.space {
  flex: 1;
}
</style>
