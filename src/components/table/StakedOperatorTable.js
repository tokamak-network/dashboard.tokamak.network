
import { orderBy } from 'lodash';

import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      from: 'name',
      order: 'desc',
    };
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operatorsStaked, (operator) => operator.name, [this.order]);

      case 'userStaked':
        return orderBy(this.operatorsStaked, (operator) => operator.userStaked.toFixed('ray'), [this.order]);

      case 'userReward':
        return orderBy(this.operatorsStaked, (operator) => operator.userReward.toFixed('ray'), [this.order]);

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
    viewDetailedOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
