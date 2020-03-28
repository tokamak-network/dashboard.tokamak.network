<template>
  <div class="row">
    <operator-info-container class="left-container" :operator="operator" style="flex: 5;" />
    <delegate-manager-container class="right-container" :operator="operator" style="flex: 3;" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';

import DelegateManagerContainer from '@/containers/DelegateManagerContainer.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

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
</script>

<style scoped>
.row {
  min-width: 100%;
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
