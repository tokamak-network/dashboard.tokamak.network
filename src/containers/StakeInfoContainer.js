
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState, mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.js';
import ContainerHeader from '@/containers/ContainerHeader.js';

export default {
  components: {
    'text-viewer': TextViewer,
    'container-header': ContainerHeader,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters([
      'userTotalReward',
      'userTotalStaked',
      'userTotalNotWithdrawable',
      'userTotalWithdrawable',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    userTotalDepositWithPendingAndRequestable () {
      return this.userTotalDeposit.sub(this.userTotalNotWithdrawable).sub(this.userTotalWithdrawable);
    },
  },
};
