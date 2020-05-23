<template>
  <div class="row">
    <operator-info-container
      class="left-container"
      :rootchain="rootchain"
    />
    <delegate-manager-container
      class="right-container"
      :rootchain="rootchain"
    />
  </div>
</template>

<script>
import DelegateManagerContainer from '@/containers/DelegateManagerContainer.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

export default {
  components: {
    'operator-info-container': OperatorInfoContainer,
    'delegate-manager-container': DelegateManagerContainer,
  },
  data () {
    return {
      rootchain: '',
    };
  },
  created () {
    this.rootchain = this.$route.params.rootchain;
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
  flex: 5;
  margin-right: 4px;
}

.right-container {
  flex: 3;
  margin-left: 4px;
}
</style>
