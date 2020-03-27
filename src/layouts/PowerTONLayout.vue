<template>
  <div>
    <div class="row">
      <viewer-round-container :round="currentRound" />
      <viewer-power-container :power="power" :total-deposits="power.totalDeposits" :rank="rank" />
    </div>
    <winner-list-container :rounds="rounds " />
    <rank-container />
  </div>
</template>

<script>
import { findIndex } from 'lodash';
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
      return 1 + findIndex(this.rankedAccountsWithPower, (account) => account.address === this.user);
    },
  },
};
</script>

<style scoped>
.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.column {
  background: red;
}
</style>
