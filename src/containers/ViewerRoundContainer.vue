<template>
  <div class="viewer-round-container">
    <text-viewer :title="'Current Round'" :content="round.index" :with-divider="true" />
    <text-viewer :title="'Round Start'" :content="formatedTimestamp(round.startTime)" :with-divider="true" />
    <text-viewer :title="'Round End'" :content="formatedTimestamp(round.endTime)" :with-divider="true" />
    <text-viewer :title="'Expected Reward'" :content="convertedTONFromWTON(round.reward)" :with-divider="true" />
    <text-viewer :title="'Winning Probability'" :content="round.winningProbability" :with-divider="false" />
  </div>
</template>

<script>
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState } from 'vuex';
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
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
  },
};
</script>

<style scoped>
.viewer-round-container {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-right: 4px;
}
</style>
