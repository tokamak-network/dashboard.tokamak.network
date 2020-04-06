
import { mapState } from 'vuex';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.js';
import TextViewer from '@/components/TextViewer.js';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'text-viewer': TextViewer,
  },
  computed: {
    ...mapState([
      'power',
      'currentRound',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    winningProbability () {
      return `${this.currentRound.winningProbability}%`;
    },
  },
};
