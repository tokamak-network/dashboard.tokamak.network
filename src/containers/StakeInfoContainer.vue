<template>
  <div class="stake-info-container">
    <container-header :title="'Staking'" />
    <text-viewer :title="'Total Staked'"
                 :content="currencyAmount(userTotalStaked)"
                 :with-divider="true"
                 :tooltip="'Sum of your total delegate-stake and reward'"
    />
    <text-viewer :title="'Total Reward'"
                 :content="currencyAmount(userTotalReward)"
                 :with-divider="false"
                 :tooltip="'Sum of all issued reward so far'"
                 :tooltipMarginTop="'-9px'"
    />
    <text-viewer :title="'Total Not Withdrawable'"
                 :content="currencyAmount(userTotalNotWithdrawable)"
                 :with-divider="false"
                 :tooltip="'Sum of your undelegate-stake reqeust amount. Each request does not withdrawable yet until 93046 blocks(14 days) passes from your request.'"
                 :tooltipWidth="'220px'"
                 :tooltipMarginTop="'-33px'"
    />
    <text-viewer :title="'Total Withdrawable'"
                 :content="currencyAmount(userTotalWithdrawable)"
                 :with-divider="false"
                 :tooltip="'Sum of all amount of undelegate-stake request which all passes 93046 blocks.'"
    />
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
