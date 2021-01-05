<template>
  <div class="delegation-state-layout">
    <chart-container />
  </div>
</template>

<script>
import ChartContainer from '@/containers/ChartContainer.vue';
import axios from 'axios';

export default {
  components: {
    'chart-container': ChartContainer,
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
.delegation-state-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
