<template>
  <div class="power-ton-layout">
    <!-- <div class="row">
      <viewer-power-container :power="power" :total-deposits="power.totalDeposits" :rank="rank" style="flex: 1; margin-right: 4px;" />
      <viewer-round-container :round="currentRound" style="flex: 1; margin-left: 4px;" />
    </div>
    <div class="row" style="margin-top: 8px;">
      <rank-container style="flex: 1; margin-right: 4px;" />
      <winner-list-container style="flex: 1; margin-left: 4px;" />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import ViewerRoundContainer from '@/containers/ViewerRoundContainer.vue';
import ViewerPowerContainer from '@/containers/ViewerPowerContainer.vue';
import WinnerListContainer from '@/containers/WinnerListContainer.vue';
import RankContainer from '@/containers/RankContainer.vue';

export default {
  components: {
    'viewer-round-container': ViewerRoundContainer,
    'viewer-power-container': ViewerPowerContainer,
    'winner-list-container': WinnerListContainer,
    'rank-container': RankContainer,
  },
  computed: {
    ...mapState([
      'user',
      'power',
      'currentRound',
      'rounds',
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    rank () {
      const account = this.rankedAccountsWithPower.find(account => account.address.toLowerCase() === this.user.toLowerCase());
      return account ? account.rank : 'no record';
    },
  },
};
</script>

<style scoped>
.power-ton-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
