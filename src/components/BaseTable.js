
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    datas: {
      type: Array,
      default: () => [],
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickTableData (data) {
      this.$emit('tableDataClicked', data);
    },
    getKey (data) {
      switch (this.type) {
      case 'operator':
        return data.rootchain;
      }
    },
    filtered (key, data, index) {
      switch (this.type) {
      case 'operator':
        if (key === 'address' || key === 'rootchain') return this.$options.filters.hexSlicer(data);
        else if (key === 'totalStaked' || key === 'userStaked') return this.$options.filters.convertedTONFromWTON(data);
        else if (key === 'recentCommitTimestamp') return this.$options.filters.fromNow(data);
        else return data;

      case 'history':
        if (key === 'transactionHash') return this.$options.filters.hexSlicer(data);
        else if (key === 'amount') return this.$options.filters.stringToTON(data);
        else return data;

      case 'winner':
        if (key === 'reward') return this.$options.filters.convertedTONFromWTON(data);
        else return data;

      case 'rank':
        if (key === 'rank') return index + 1;
        else return data;

      default:
        return data;
      }
    },
  },
};
