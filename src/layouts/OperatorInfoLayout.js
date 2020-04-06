
import { cloneDeep } from 'lodash';

import DelegateManagerContainer from '@/containers/DelegateManagerContainer.js';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.js';

export default {
  components: {
    'operator-info-container': OperatorInfoContainer,
    'delegate-manager-container': DelegateManagerContainer,
  },
  computed: {
    operator () {
      const rootchain = this.$route.params.rootchain;
      return cloneDeep(this.$store.getters.operatorByRootChain(rootchain));
    },
  },
};
