<template>
  <div class="viewer-round-container">
    <text-viewer :title="'CURRENT ROUND'" :content="round.index" />
    <text-viewer :title="'ROUND start'" :content="formatedTimestamp(round.startTime)" />
    <text-viewer :title="'ROUND finish'" :content="formatedTimestamp(round.endTime)" />
    <text-viewer :title="'EXPECTED REWARD'" :content="convertedTONFromWTON(round.reward)" />
    <text-viewer :title="'CURRENT BLOCK NUMBER'" :content="blockNumber" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="winningProbability" />
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

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
    ...mapState([
      'blockNumber',
    ]),
    formatedTimestamp () {
      return timestamp => moment.unix(timestamp).format('LLL');
    },
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
    winningProbability () {
      return `${this.round.winningProbability}%`;
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
