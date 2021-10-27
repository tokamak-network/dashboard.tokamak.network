<template>
  <div class="dashboard-layout">
    <div class="column" style="flex: 7;">
      <dashboard-operator-list />
      <dashboard-history />
    </div>
    <div class="column" style="flex: 4;">
      <dashboard-staking />
    </div>
  </div>
</template>

<script>
import DashboardOperatorList from '@/containers/dashboard/DashboardOperatorList.vue';
import DashboardStaking from '@/containers/dashboard/DashboardStaking.vue';
import DashboardHistory from '@/containers/dashboard/DashboardHistory.vue';


export default {
  components: {
    'dashboard-operator-list': DashboardOperatorList,
    'dashboard-staking': DashboardStaking,
    'dashboard-history': DashboardHistory,
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}
</style>
