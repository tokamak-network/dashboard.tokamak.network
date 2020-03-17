<template>
  <div>
    <div class="row">
      <viewer-round-container />
      <viewer-power-container />
    </div>
    <winner-list-container />
  </div>
</template>

<script>
import ViewerRoundContainer from '@/containers/ViewerRoundContainer.vue';
import ViewerPowerContainer from '@/containers/ViewerPowerContainer.vue';
import WinnerListContainer from '@/containers/WinnerListContainer.vue';

export default {
  components: {
    'viewer-round-container': ViewerRoundContainer,
    'viewer-power-container': ViewerPowerContainer,
    'winner-list-container': WinnerListContainer,
  },
};
</script>

<style scoped>
.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.column {
  background: red;
}
</style>
