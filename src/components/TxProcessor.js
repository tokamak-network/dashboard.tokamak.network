
import config from '../../config.json';

import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'pendingTransactions',
    ]),
    href () {
      return transactionHash => config.prefixTransactionHash + transactionHash;
    },
  },
};
