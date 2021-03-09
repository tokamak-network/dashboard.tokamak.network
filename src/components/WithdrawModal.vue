<template>
  <div class="model-container">
    <button @click="closeModal('withdraw')">X</button>
    <div>Withdraw</div>
    <div>Do you really want to withdraw your tokens now?</div>
    <div>{{ availableAmountToWithdraw | currencyAmount }}</div>
    <button @click="setAvailableAmountToWithdraw">MAX</button>
    <div>Available Balance</div>
    <div>{{ operator.userWithdrawable | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="withdraw">Withdraw</button>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
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
      availableAmountToWithdraw: 0,
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
  },
  methods:{
    withdraw () {
      const userWithdrawable = this.operator.userWithdrawable;
      if (userWithdrawable.isEqual(_WTON.ray('0'))) {
        return alert('Withdrawable amount is 0.');
      }
      const count = this.operator.withdrawableRequests.length;
      if (count === 0) {
        return alert('Withdrawable amount is 0.');
      }

      const amount = _WTON(userWithdrawable).toFixed('ray');
      this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        true,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Withdrawn',
            amount: amount,
            transactionHash: hash,
            target: this.operator.layer2,
          };
          this.$store.dispatch('addPendingTransaction', transcation);
        })
        .on('receipt', async receipt => {
          this.index = 0;
        });
    },
    closeModal (method) {
      this.$emit('closePopup', method);
    },
    setAvailableAmountToWithdraw () {
      this.availableAmountToWithdraw = this.operator.userWithdrawable;
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
