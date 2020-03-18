<template>
  <div class="dashboard-power">
    <dashboard-header :title="'POWER'" />
    <text-viewer :title="'POWER'" :content="'100.00 TON'" />
    <text-viewer :title="'ROUND'" :content="'16'" />
    <text-viewer :title="'REWARD'" :content="'100.00 TON'" />
    <div class="space" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="'100%'" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'text-viewer': TextViewer,
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
