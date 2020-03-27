<template>
  <div class="dashboard-power">
    <dashboard-header :title="'POWER'" :path="'powerton'" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="currentRound.winningProbability" :with-divider="true" />
    <text-viewer :title="'POWER'" :content="power" :with-divider="true" />
    <text-viewer :title="'ROUND'" :content="currentRound.index" :with-divider="true" />
    <text-viewer :title="'EXPECTED REWARD'" :content="convertedTONFromWTON(currentRound.reward)" :with-divider="false" />
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
  computed: {
    ...mapState([
      'power',
      'currentRound',
    ]),
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
    winningProbability () {
      return `${this.currentRound.winningProbability}%`;
    },
  },
};
</script>

<style scoped>
.dashboard-power {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-left: 8px;
  margin-top: 8px;
}
</style>
