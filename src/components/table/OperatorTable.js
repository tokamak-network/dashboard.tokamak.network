
import { orderBy } from 'lodash';

import { mapState } from 'vuex';

export default {
  data () {
    return {
      from: 'name',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operators, (operator) => operator.name, [this.order]);
      case 'operator':
        return orderBy(this.operators, (operator) => operator.address, [this.order]);
      case 'rootchain':
        return orderBy(this.operators, (operator) => operator.rootchain, [this.order]);
      case 'userStaked':
        return orderBy(this.operators, (operator) => operator.userStaked.toNumber(), [this.order]);
      case 'totalStaked':
        return orderBy(this.operators, (operator) => operator.totalStaked.toNumber(), [this.order]);

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
