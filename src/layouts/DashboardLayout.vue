<template>
  <div>
    <div class="dashboard-layout">
      <div
        class="dashboard-container"
        style="margin-right: 8px;"
      >
        <div class="dashboard-title-container">
          <div class="dashboard-title">
            Operator List
          </div>
          <div
            class="dashboard-more-button"
            @click="$router.push('/operators')"
          >
            More
          </div>
        </div>
        <operator-list style="margin-right: 1px;" />
      </div>
      <div
        class="dashboard-container"
        style="margin-left: 8px;"
      >
        <div class="dashboard-title-container">
          <div
            class="dashboard-title"
          >
            My Stake
          </div>
          <div
            class="dashboard-more-button"
            @click="$router.push('/staking')"
          >
            More
          </div>
        </div>
        <div class="stake-infos-container">
          <stake-info />
        </div>
      </div>
    </div>
    <div
      class="dashboard-container"
      style="margin-top: 16px;"
    >
      <div class="dashboard-title-container">
        <div class="dashboard-title">
          History
        </div>
        <div
          class="dashboard-more-button"
          @click="$router.push('/history')"
        >
          More
        </div>
      </div>
      <staking-history style="margin-right: 1px;" />
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

.dashboard-title-container {
  display: flex;
  height: 48.5px;
  align-items: center;
}

.dashboard-title {
  flex: 1;
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

.stake-infos-container {
  height: 265.5px;
  overflow-y: scroll;
  border-bottom: solid 1px #ced6d9;
  border-top: solid 0.5px #dce2e5;
}

.dashboard-more-button {
  letter-spacing: 0.7px;
  padding-right: 16px;
  font-size: 11px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  text-align: center;
  color: #bbb8b8;
}

.dashboard-more-button:hover {
  cursor: pointer;
  color: #124b71;
}
</style>
