<template>
  <div class="viewer-round-container">
    <container-header :title="'Round'" />
    <text-viewer :title="'Current Round'" :content="round.index" :with-divider="true" />
    <text-viewer :title="'Round Start'" :content="formatedTimestamp(round.startTime)" :with-divider="false" />
    <text-viewer :title="'Round End'" :content="formatedTimestamp(round.endTime)" :with-divider="false" />
    <text-viewer :title="'Expected Reward'" :content="convertedTONFromWTON(round.reward)" :with-divider="false" />
    <text-viewer :title="'Winning Probability'" :content="round.winningProbability" :with-divider="false" />
  </div>
</template>

<script>
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'container-header': ContainerHeader,
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
}
</style>
