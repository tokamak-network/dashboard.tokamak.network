
import ContainerHeader from '@/containers/ContainerHeader.js';
import TextViewer from '@/components/TextViewer.js';

export default {
  components: {
    'container-header': ContainerHeader,
    'text-viewer': TextViewer,
  },
  props: {
    power: {
    },
    rank: {
    },
  },
  computed: {
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
};
