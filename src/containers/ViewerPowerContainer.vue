<template>
  <div class="viewer-power-container">
    <text-viewer :title="'POWER'" :content="power" />
    <!-- <text-viewer :title="'TOTAL POWER'" :content="totalDeposits.toString()" /> -->
    <!-- <text-viewer :title="'WINNING PROBABILITY'" :content="winningProbability.toString()" /> -->
    <text-viewer :title="'RANK'" :content="'1'" />
  </div>
</template>

<script>
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
  props: {
    power : {
    },
    totalDeposits: {
    },
  },
  data () {
    return {
      winningProbability: '',
    };
  },
  created () {
    // this.winningProbability = `${this.power.div(this.totalDeposits).mul(100).toNumber()}%`;
  },
};
</script>

<style scoped>
.viewer-power-container {
  width: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-left: 4px;
}

.column {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
