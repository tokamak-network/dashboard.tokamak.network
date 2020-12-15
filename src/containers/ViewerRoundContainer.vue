<template>
  <div class="viewer-round-container">
    <div class="row">
      <container-header :title="'Round'" style="flex: 1;" />
      <button v-if="isRoundEnd"
              @click="endRound()"
      >
        End Round
      </button>
    </div>
    <text-viewer :title="'Round Number'" :content="round.index" :with-divider="true" />
    <text-viewer :title="'Round Start'" :content="formattedTimestamp(round.startTime)" :with-divider="false" />
    <text-viewer :title="'Round End'" :content="formattedTimestamp(round.endTime)" :with-divider="false" />
    <text-viewer :title="'Round Prize'" :content="currencyAmount(round.reward.add(uncommittedCurrentRoundReward))" :with-divider="false" />
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
    ...mapState([
      'PowerTON',
      'uncommittedCurrentRoundReward',
      'currentRound',
      'blockTimestamp',
    ]),
    formattedTimestamp () {
      return timestamp => this.$options.filters.formattedTimestamp(timestamp);
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    isRoundEnd () {
      return this.currentRound.endTime <= this.blockTimestamp ? true : false;
    },
  },
  methods: {
    async endRound () {
      const gasLimit = await this.PowerTON.methods.endRound()
        .estimateGas({
          from: this.user,
          gasLimit: Math.floor(gasLimit * 1.2),
        });

      await this.PowerTON.methods.endRound()
        .send({
          from: this.user,
          gasLimit: Math.floor(gasLimit * 1.2),
        }).on('receipt', (receipt) => {
          if (receipt.status) {
            this.$notify({
              group: 'confirmed',
              title: 'Transaction is confirmed',
              type: 'success',
              duration: 10000,
            });
          } else {
            this.$notify({
              group: 'reverted',
              title: 'Transaction is reverted',
              type: 'error',
              duration: 10000,
            });
          }
        });
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

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

button {
  height: 24px;
  color: #ffffff;
  background-color: #6fc4b3;
  border: 1px solid #6fc4b3;
  text-align: center;
  font-size: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-left: 16px;
  margin-right: 8px;
  border-radius: 6px;
}

button:hover {
  cursor: pointer;
}
</style>
