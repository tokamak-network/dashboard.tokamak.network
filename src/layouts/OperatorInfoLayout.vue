<template>
  <div class="row">
    <operator-info-container
      class="left-container"
      :layer2="layer2"
    />
    <delegate-manager-container
      class="right-container"
      :layer2="layer2"
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
      layer2: '',
    };
  },
  created () {
    this.layer2 = this.$route.params.layer2;
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
