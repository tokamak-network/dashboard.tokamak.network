<template>
  <div class="stake-info-container">
    <text-viewer :title="'Expected Reward'" :content="convertedTONFromWTON(userTotalReward)" />
    <div class="space" />
    <text-viewer :title="'Total Deposit Amount'" :content="convertedTONFromWTON(userTotalDeposit)" />
    <text-viewer :title="'Total Staked Amount'" :content="convertedTONFromWTON(userTotalStaked)" />
    <text-viewer :title="'Total Pending Amount'" :content="convertedTONFromWTON(userTotalPending)" />
    <text-viewer :title="'Total Withdrawable Amount'" :content="convertedTONFromWTON(userTotalWithdrawable)" />
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
      'userTotalPending',
      'userTotalWithdrawable',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
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
