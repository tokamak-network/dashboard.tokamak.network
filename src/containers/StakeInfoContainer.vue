<template>
  <div class="stake-info-container">
    <text-viewer :title="'TOTAL DEPOSITED TON'" :content="convertedTONFromWTON(userTotalDepositWithPendingAndRequestable)" />
    <text-viewer :title="'TOTAL STAKED TON'" :content="convertedTONFromWTON(userTotalStaked)" />
    <text-viewer :title="'TOTAL REWARD'" :content="convertedTONFromWTON(userTotalReward)" />
    <div class="space" />
    <text-viewer :title="'TOTAL NOT WITHDRAWABLE TON'" :content="convertedTONFromWTON(userTotalNotWithdrawable)" />
    <text-viewer :title="'TOTAL WITHDRAWABLE TON'" :content="convertedTONFromWTON(userTotalWithdrawable)" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

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
      'userTotalDeposit',
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
