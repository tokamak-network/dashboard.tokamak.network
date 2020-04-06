
import { mapState, mapGetters } from 'vuex';
import ViewerRoundContainer from '@/containers/ViewerRoundContainer.js';
import ViewerPowerContainer from '@/containers/ViewerPowerContainer.js';
import WinnerListContainer from '@/containers/WinnerListContainer.js';
import RankContainer from '@/containers/RankContainer.js';

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
