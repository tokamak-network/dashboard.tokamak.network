
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.js';
import TextViewer from '@/components/TextViewer.js';

export default {
  components: {
    'container-header': ContainerHeader,
    'text-viewer': TextViewer,
  },
  props: {
    round: {
      type: Object,
    },
  },
  computed: {
    formatedTimestamp () {
      return timestamp => moment.unix(timestamp).format('LLL');
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
};
