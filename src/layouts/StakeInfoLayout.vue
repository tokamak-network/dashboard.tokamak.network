<template>
  <div class="stake-info-layout">
    <div
      v-for="(operator, index) in operators"
      :key="index"
    >
      <stake-info-container />
    </div>
  </div>
</template>

<script>
import StakeInfoContainer from '@/containers/StakeInfoContainer.vue';

export default {
  components: {
    'stake-info-container': StakeInfoContainer,
  },
  data () {
    return {
      operators: [1],
    };
  },
};
</script>

<style>
.stake-info-layout {
  margin-top: -8px;
}
</style>
