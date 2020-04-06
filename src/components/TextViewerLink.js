
import config from '../../config.json';

export default {
  props: {
    title: {
      type: String,
    },
    content: {
    },
    type: {
      // transactionHash or address
    },
    withDivider: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    href () {
      if (this.type === 'transactionHash') {
        return config.prefixTransactionHash + this.content;
      } else if (this.type === 'address') {
        return config.prefixAddress + this.content;
      } else {
        return this.content;
      }
    },
  },
};
