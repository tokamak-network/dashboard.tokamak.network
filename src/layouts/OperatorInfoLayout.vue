<template>
  <div class="row">
    <operator-info-container class="left-container" :operator="operator" />
    <delegate-manager-container class="right-container" :operator="operator" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

import DelegateManagerContainer from '@/containers/DelegateManagerContainer.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

export default {
  components: {
    'delegate-manager-container': DelegateManagerContainer,
    'operator-info-container': OperatorInfoContainer,
  },
  computed: {
    operator () {
      const rootchain = this.$route.params.rootchain;
      return cloneDeep(this.$store.getters.operatorByRootChain(rootchain));
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}

.left-container {
  flex: 1;
  margin-right: 4px;
}

.right-container {
  flex: 1;
  margin-left: 4px;
}
</style>
