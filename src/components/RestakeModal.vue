<template>
  <div class="model-container">
    <button @click="closeModal('restake')">X</button>
    <div>Re-stake</div>
    <div>You can earn TON and Power</div>
    <div>Available Balance</div>
    <div>{{ redelegatableAmount | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="redelegate">Re-stake</button>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { BN, padLeft } from 'web3-utils';
import { range } from 'lodash';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
export default {
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      availableAmountToRedelegate: 0,
      index: 0,
    };
  },
  computed: {
    ...mapState([
      'web3',
      'blockNumber',
      'user',
      'tonBalance',
      'TON',
      'WTON',
      'DepositManager',
      'SeigManager',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    withdrawableRequests () {
      return this.operator.withdrawalRequests.length;
    },
    redelegatableRequests () {
      return this.operator.withdrawalRequests.length - this.index;
    },
    redelegatableAmount () {
      let amount = new BN(0);
      for (const i of range(this.redelegatableRequests)) {
        amount = amount.add(new BN(this.operator.withdrawalRequests[i].amount));
      }
      return _WTON(amount.toString(), 'ray');
    },
  },
  methods:{
    increaseIndex () {
      this.index++;
      if (this.operator.withdrawalRequests.length === 0 ||
          this.index === this.operator.withdrawalRequests.length) {
        this.index = 0;
      }
    },
    redelegate () {
      if (this.operator.withdrawalRequests.length === 0) {
        return alert('Redelegatable amount is 0.');
      }

      const amount = this.redelegatableAmount.toFixed('ray');

      this.DepositManager.methods.redepositMulti(
        this.operator.layer2,
        this.redelegatableRequests,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Redelegated',
            amount,
            transactionHash: hash,
            target: this.operator.layer2,
          };
          this.$store.dispatch('addPendingTransaction', transcation);
        })
        .on('receipt', (receipt) => {
          this.$store.dispatch('set', this.web3);
          this.index = 0; // after contract state is updated, display max redelegatable amount.
        });
    },
    closeModal (method) {
      this.$emit('closePopup', method);
    },
    setAvailableAmountToRedelegate () {
      this.availableAmountToRedelegate = this.redelegatableAmount;
    },
  },
};
</script>
<style scoped>
.model-container {
    height: 200px;
    width: 200px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
}
</style>
