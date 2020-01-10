<template>
  <div>
    <div class="dashboard-layout">
      <div
        class="dashboard-container"
        style="margin-right: 8px;"
      >
        <div class="dashboard-title">
          My Stake
        </div>
        <stake-info />
      </div>


      <div
        class="dashboard-container"
        style="margin-left: 8px;"
      >
        <div class="dashboard-title">
          Operator List
        </div>
        <operator-list />
      </div>
    </div>
    <div
      class="dashboard-container"
      style="margin-top: 16px;"
    >
      <div class="dashboard-title">
        History
      </div>
      <staking-history />
    </div>
  </div>
</template>

<script>
import StakingHistory from '@/containers/dashboard/StakingHistory.vue';
import OperatorList from '@/containers/dashboard/OperatorList.vue';
import StakeInfo from '@/containers/dashboard/StakeInfo.vue';

export default {
  components: {
    'staking-history': StakingHistory,
    'operator-list': OperatorList,
    'stake-info': StakeInfo,
  },
};
</script>

<style>
.dashboard-layout {
  display: flex;
}

.dashboard-container {
  width: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}

.dashboard-title {
  height: 48.5px;
  display: table-cell;
  vertical-align: middle;
  text-align: left;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  padding-left: 20px;
  color: #124b71;
}
</style>
