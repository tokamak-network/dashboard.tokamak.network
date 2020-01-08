<template>
  <div class="dashboard-layout">
    <div>
      <stake-info-container />
      <operator-list-container />
    </div>
    <history-container />
  </div>
</template>

<script>
import HistoryContainer from '@/containers/dashboard/HistoryContainer.vue';
import OperatorListContainer from '@/containers/dashboard/OperatorListContainer.vue';
import StakeInfoContainer from '@/containers/dashboard/StakeInfoContainer.vue';

export default {
  components: {
    'history-container': HistoryContainer,
    'operator-list-container': OperatorListContainer,
    'stake-info-container': StakeInfoContainer,
  },
};
</script>

<style>
.dashboard-layout {
  display: flex;
}
</style>
