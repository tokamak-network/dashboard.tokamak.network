<template>
  <div class="dashboard-power">
    <dashboard-header :title="'POWER'" :path="'powerton'" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="winningProbability" />
    <div class="space" />
    <text-viewer :title="'POWER'" :content="power" />
    <text-viewer :title="'ROUND'" :content="currentRound.index" />
    <text-viewer :title="'EXPECTED REWARD'" :content="convertedTONFromWTON(currentRound.reward)" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      winningProbability: '',
    };
  },
  computed: {
    ...mapState([
      'power',
      'currentRound',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
  },
  created () {
    this.winningProbability = '1 %';
  },
};
</script>

<style scoped>
.dashboard-power {
  flex: 4;
  min-height: 314px;
  max-height: 314px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-left: 8px;
  margin-top: 8px;
}

.space {
  flex: 1;
}
</style>
