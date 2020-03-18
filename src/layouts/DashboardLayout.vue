<template>
  <div class="dashboard-layout">
    <div class="row">
      <dashboard-operator-list />
      <dashboard-staking />
    </div>
    <div class="row">
      <dashboard-history />
      <dashboard-power />
    </div>
  </div>
</template>

<script>
import DashboardOperatorList from '@/containers/dashboard/DashboardOperatorList.vue';
import DashboardStaking from '@/containers/dashboard/DashboardStaking.vue';
import DashboardHistory from '@/containers/dashboard/DashboardHistory.vue';
import DashboardPower from '@/containers/dashboard/DashboardPower.vue';

export default {
  components: {
    'dashboard-operator-list': DashboardOperatorList,
    'dashboard-staking': DashboardStaking,
    'dashboard-history': DashboardHistory,
    'dashboard-power': DashboardPower,
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
}
</style>
