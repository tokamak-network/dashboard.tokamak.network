<template>
  <div class="model-container">
    <button @click="closeModal('stake')">X</button>
    <div>staking</div>
    <div>You can earn TON and Power</div>
    <!-- <div>{{ availableAmountToDelegate | currencyAmount }}</div> -->
    <input v-model="availableAmountToDelegate" @keypress="isNumber">
    <button @click="setAvailableAmountToDelegate">MAX</button>
    <div>Available Balance</div>
    <div>{{ tonBalance | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="delegate">Stake</button>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { BN, padLeft } from 'web3-utils';
import { range } from 'lodash';
import { addHistory, addTransaction } from '@/api';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

export default {
  props: {
    layer2: {
      required: true,
      type: String,
    },
    amount: {
      required: true,
    },
  },
  data () {
    return {
      availableAmountToDelegate: 0,
    };
  },
  computed: {
    ...mapState([
      'power',
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
    notWithdrawableMessage () {
      return withdrawableBlockNumber => `You have to wait for ${withdrawableBlockNumber - this.blockNumber} blocks to withdraw all the tokens.`;
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
    disableButton () {
      return false;
    },
    minimumAmount () {
      return this.SeigManager.methods.minimumAmount().call();
    },
    operatorMinimumAmount (){
      const operatorDeposit = this.operator.selfDeposit;
      const minimumAmount = this.operator.minimumAmount;
      const lessThan = operatorDeposit < minimumAmount;
      if (this.user !== this.operator.address ) {
        return lessThan;
      }
      else {
        return false;
      }
    },
  },

  created (){
    this.availableAmountToDelegate = this.amount;
  },
  methods:{
    closeModal (method) {
      this.$emit('closePopup', method);
    },
    setAvailableAmountToDelegate () {
      const tonAmount = this.tonBalance.toBigNumber().toString();
      const index = tonAmount.indexOf('.');
      if (index === -1) {
        this.availableAmountToDelegate = tonAmount + '.00';
      } else {
        this.availableAmountToDelegate = tonAmount;
      }
    },
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    marshalString (str) {
      if (str.slice(0, 2) === '0x') return str;
      return '0x'.concat(str);
    },
    unmarshalString (str) {
      if (str.slice(0, 2) === '0x') return str.slice(2);
      return str;
    },
    getData () {
      const data = this.marshalString(
        [this.DepositManager._address, this.operator.layer2]
          .map(this.unmarshalString)
          .map(str => padLeft(str, 64))
          .join('')
      );
      return data;
    },
    async delegate () {
      if (this.availableAmountToDelegate === '' || parseFloat(this.amountToDelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_TON(this.availableAmountToDelegate).gt(this.tonBalance)) {
        return alert('Please check your TON amount.');
      }
      if(confirm('Current withdrawal delay is 2 weeks. Are you sure you want to delegate?')){
        const data = this.getData();
        const amount = _TON(this.availableAmountToDelegate).toFixed('wei');
        console.log(this.availableAmountToDelegate);
        this.TON.methods.approveAndCall(
          this.WTON._address,
          amount,
          data,
        ).send({ from: this.user })
          .on('transactionHash', async (hash) => {
            const transcation = {
              from: this.user,
              type: 'Delegated',
              amount: amount,
              transactionHash: hash,
              target: this.operator.layer2,
            };
            this.$store.dispatch('addPendingTransaction', transcation);
          })
          .on('receipt', (receipt) => {
            this.index = 0;
          });

        this.availableAmountToDelegate = '';
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
