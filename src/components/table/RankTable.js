
import { orderBy } from 'lodash';

import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      from: 'rank',
      order: 'desc',
    };
  },
  computed: {
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    orderedRank () {
      switch (this.from) {
      case 'rank':
        return orderBy(this.rankedAccountsWithPower, (account) => account.rank, [this.order === 'desc' ? 'asc' : 'desc']);

      case 'account':
        return orderBy(this.rankedAccountsWithPower, (account) => account.address, [this.order]);

      case 'power':
        return orderBy(this.rankedAccountsWithPower, (account) => account.power.toNumber(), [this.order]);

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
