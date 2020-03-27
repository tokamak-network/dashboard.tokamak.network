<template>
  <div class="operator-info-layout">
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
.operator-info-layout {
  margin-top: 24px;
  display: flex;
  flex-direction: row;
}

.left-container {
  flex: 7;
  margin-right: 16px;
}

.right-container {
  flex: 4;
  margin-left: 16px;
}
</style>
