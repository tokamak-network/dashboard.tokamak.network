<template>
  <div>
    <div class="row">
      <viewer-round-container :round="power.currentRound" />
      <viewer-power-container :power="power.power" />
    </div>
    <winner-list-container :rounds="power.rounds " />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ViewerRoundContainer from '@/containers/ViewerRoundContainer.vue';
import ViewerPowerContainer from '@/containers/ViewerPowerContainer.vue';
import WinnerListContainer from '@/containers/WinnerListContainer.vue';

export default {
  components: {
    'viewer-round-container': ViewerRoundContainer,
    'viewer-power-container': ViewerPowerContainer,
    'winner-list-container': WinnerListContainer,
  },
  computed: {
    ...mapState([
      'power',
    ]),
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
