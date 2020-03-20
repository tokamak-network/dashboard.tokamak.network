<template>
  <div class="viewer-round-container">
    <text-viewer :title="'ROUND'" :content="round.index" />
    <text-viewer :title="'ROUND start'" :content="formatedTimestamp(round.startTime)" />
    <text-viewer :title="'ROUND finish'" :content="formatedTimestamp(round.endTime)" />
    <text-viewer :title="'EXPECTED REWARD'" :content="round.reward" />
    <text-viewer :title="'current block number'" :content="'30'" />
  </div>
</template>

<script>
import moment from 'moment';

import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
  props: {
    round: {
      type: Object,
    },
  },
  computed: {
    formatedTimestamp () {
      return timestamp => moment.unix(timestamp).format('LLL');
    },
  },
};
</script>

<style scoped>
.viewer-round-container {
  width: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-right: 4px;
}
</style>
