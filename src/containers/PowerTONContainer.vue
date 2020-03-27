<template>
  <div class="power-ton-container">
    <h4>Power TON</h4>
    <text-viewer :title="'Current Round'" :content="currentRound.index" />
    <text-viewer :title="'Round Start'" :content="formatedTimestamp(currentRound.startTime)" />
    <text-viewer :title="'Round End'" :content="formatedTimestamp(currentRound.endTime)" />
    <text-viewer :title="'Expected Reward'" :content="convertedTONFromWTON(currentRound.reward)" />
    <text-viewer :title="'Winning Probability'" :content="currentRound.winningProbability" />
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
  computed: {
    ...mapState([
      'currentRound',
    ]),
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
h4 {
  padding: 0;
  margin: 0;
}
</style>
