<template>
  <div class="model-container">
    <button @click="closeModal('unstake')">+</button>
    <div>Unstake</div>
    <div>Do you really want to unstake your TON now?</div>
    <div>* Withdrawal delay is about 2 weeks</div>
    <div>{{ operator.userStaked | currencyAmount }}</div>
    <button @click="setAvailableAmountToUndelegate">MAX</button>
    <div>Available Balance</div>
    <div>{{ operator.userStaked | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="undelegate">Unstake</button>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';

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
      availableAmountToUndelegate: 0,
    };
  },
  computed: {
    ...mapState([
      'web3',
      'blockNumber',
      'TON',
      'WTON',
      'DepositManager',
      'SeigManager',
      'tonBalance',
      'user',
      'power',
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
    undelegate () {
      if (this.availableAmountToUndelegate === '' || parseFloat(this.availableAmountToUndelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_WTON(this.availableAmountToUndelegate).gt(this.operator.userStaked)){
        return alert('Please check your TON amount.');
      }

      const amount = _WTON(this.availableAmountToUndelegate).toFixed('ray');
      this.DepositManager.methods.requestWithdrawal(
        this.operator.layer2,
        amount,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Undelegated',
            amount: amount,
            transactionHash: hash,
            target: this.operator.layer2,
          };
          this.$store.dispatch('addPendingTransaction', transcation);
        })
        .on('receipt', (receipt) => {
          this.index = 0;
        });

      this.availableAmountToUndelegate = '';
    },
    closeModal (method) {
      this.$emit('closePopup', method);
    },
    setAvailableAmountToUndelegate () {
      const tonAmount = this.operator.userStaked.toBigNumber().toString();
      const index = tonAmount.indexOf('.');
      if (index === -1) {
        this.availableAmountToUndelegate = tonAmount + '.00';
      } else {
        this.availableAmountToUndelegate = tonAmount;
      }
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
