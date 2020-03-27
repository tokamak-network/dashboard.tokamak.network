<template>
  <div class="main-layout">
    <div class="row">
      <div class="column" style="margin-right: 24px;">
        <account-container />
      </div>
      <div class="column" style="margin-left: 24px;">
        <network-container />
        <staking-container style="margin-top: 32px;" />
        <power-ton-container style="margin-top: 32px;" />
      </div>
    </div>
    <operator-container style="margin-top: 32px; margin-bottom: 32px;" />
    <div class="row">
      <rank-container style="flex: 1; margin-right: 24px;" />
      <winner-container style="flex: 1; margin-left: 24px;" />
    </div>
  </div>
</template>

<script>
import NetworkContainer from '@/containers/NetworkContainer.vue';
import AccountContainer from '@/containers/AccountContainer.vue';
import StakingContainer from '@/containers/StakingContainer.vue';
import PowerTONContainer from '@/containers/PowerTONContainer.vue';
import OperatorContainer from '@/containers/OperatorContainer.vue';
import RankContainer from '@/containers/RankContainer.vue';
import WinnerContainer from '@/containers/WinnerContainer.vue';

export default {
  components: {
    'network-container': NetworkContainer,
    'account-container': AccountContainer,
    'staking-container': StakingContainer,
    'power-ton-container': PowerTONContainer,
    'operator-container': OperatorContainer,
    'rank-container': RankContainer,
    'winner-container': WinnerContainer,
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  width: 100vh;
  margin-top: 24px;
  padding-top: 16px;
  padding-bottom: 2rem;
}

.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.row .column {
  flex: 1;
}
</style>
