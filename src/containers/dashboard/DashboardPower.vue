<template>
  <div class="dashboard-power">
    <dashboard-header :title="'POWER'" :path="'powerton'" />
    <text-viewer :title="'POWER'" :content="power.power" />
    <text-viewer :title="'ROUND'" :content="power.currentRound.currentRound" />
    <text-viewer :title="'REWARD'" :content="power.currentRound.reward" />
    <div class="space" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="winningProbability" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

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
    ]),
  },
  created () {
    this.winningProbability = `${this.power.power.div(this.power.totalDeposits).mul(100).toNumber()}%`;
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
