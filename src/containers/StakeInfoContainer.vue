<template>
  <div class="stake-info-container">
    <container-header :title="'Staking'" />
    <text-viewer :title="'Total Staked MTON'" :content="currencyAmount(userTotalStaked)" :with-divider="true" />
    <text-viewer :title="'Total Reward MTON'" :content="currencyAmount(userTotalReward)" :with-divider="false" />
    <text-viewer :title="'Total Not Withdrawable MTON'" :content="currencyAmount(userTotalNotWithdrawable)" :with-divider="false" />
    <text-viewer :title="'Total Withdrawable MTON'" :content="currencyAmount(userTotalWithdrawable)" :with-divider="false" />
  </div>
</template>

<script>
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState, mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.vue';
import ContainerHeader from '@/containers/ContainerHeader.vue';

export default {
  components: {
    'text-viewer': TextViewer,
    'container-header': ContainerHeader,
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
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
};
</script>

<style scoped>
.stake-info-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-right: 4px;
}

.space {
  flex: 1;
}
</style>
