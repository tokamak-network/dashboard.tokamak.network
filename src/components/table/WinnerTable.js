
import { orderBy } from 'lodash';

import { mapState } from 'vuex';

export default {
  data () {
    return {
      from: 'round',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'rounds',
    ]),
    orderedRound () {
      switch (this.from) {
      case 'round':
        return orderBy(this.rounds, (round) => round.index, [this.order]);

      case 'winner':
        return orderBy(this.rounds, (round) => round.winner, [this.order]);

      case 'reward':
        // TODO: test bignumber of reward.toNumber()
        return orderBy(this.rounds, (round) => round.reward.toNumber(), [this.order]);

      default:
        return [];
      }
    },
    withArrow () {
      return (from, label) => {
        if (this.from === from) {
          return this.order === 'desc' ? `${label} ↑` : `${label} ↓`;
        }
        return label;
      };
    },
  },
  methods: {
    orderBy (from) {
      if (this.from === from) {
        this.order = this.changedOrder();
      } else {
        this.from = from;
        this.order = 'desc';
      }
    },
    changedOrder () {
      return this.order === 'desc' ? 'asc' : 'desc';
    },
  },
};
