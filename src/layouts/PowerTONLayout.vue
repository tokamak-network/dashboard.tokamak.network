<template>
  <div>
    <div class="row">
      <viewer-round-container :round="currentRound" style="flex: 1;" />
      <viewer-power-container :power="power" :total-deposits="power.totalDeposits" :rank="rank" style="flex: 1;" />
    </div>
    <div class="row">
      <winner-list-container style="flex: 1; margin-right: 4px;" />
      <rank-container style="flex: 1; margin-left: 4px;" />
    </div>
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
      return (this.rankedAccountsWithPower.find(account => account.address.toLowerCase() === this.user.toLowerCase())).rank;
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}

.column {
  background: red;
}
</style>
