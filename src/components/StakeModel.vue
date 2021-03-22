<template>
  <div class="model-wrapper">
    <div class="model-container">
      <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closeModal('stake')"
        >
      </div>
      <div class="model-content">
        <h1 class="model-content-title">Staking</h1>
        <h2 class="model-content-subTitle">You can earn TON and Power</h2>
        <div class="model-line" />
        <div class="model-ton-stake">
          <input
            id="inputTonFiled"
            v-model="inputTon"
            class="model-ton-stake-input"
            :class="{'model-ton-stake-input-blink' : inputTon === '0' || inputTon === ''}"
            value="0"
            :style="{width: (inputTon.length * 22) + 'px'}"
            @keypress="isNumber"
          >
          <button class="model-ton-stake-btn" @click="makeInputMax">MAX</button>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Ton Balance</h3>
          <div class="model-ton-balance-amount">
            <span class="model-ton-balance-amount-number">{{ tonBalance }}</span>
          </div>
        </div>
        <div class="model-line model-line-bottom" />
        <button class="model-btn"
                :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                :disabled="inputTon === '0' || inputTon === ''"
                @click="delegate"
        >
          Stake
        </button>

        <!-- <div>{{ availableAmountToDelegate | currencyAmount }}</div> -->
        <!-- <input v-model="availableAmountToDelegate" @keypress="isNumber">
        <div>Available Balance</div>
        <div>{{ tonBalance | currencyAmount }}</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { BN, padLeft } from 'web3-utils';
import { range } from 'lodash';
import { addHistory, addTransaction } from '@/api';
import { createCurrency } from '@makerdao/currency';
import moment from 'moment';
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
      inputTon: '0',
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
  watch: {
    inputTon: function (newValue) {
      let result;
      if(newValue === '.') {
        console.log('dot');
        result = newValue;
      } else {
        result = newValue.replace(/[^0-9a-zA-Z.]/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      Vue.nextTick(() => this.inputTon = result);
    },
  },
  created (){
    this.availableAmountToDelegate = this.amount;
  },
  methods:{
    makeInputMax () {
      const tonAmount = this.tonBalance.toBigNumber().toString();
      this.inputTon = tonAmount;
    },
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
      const value = parseFloat(this.inputTon.replace(/,/g, ''));
      if (value === 0) {
        return alert('Please check input amount.');
      }
      if (_TON(value).gt(this.tonBalance)) {
        return alert('Please check your TON amount.');
      }
      if(confirm('Current withdrawal delay is 2 weeks. Are you sure you want to delegate?')){
        const data = this.getData();
        const amount = _TON(value).toFixed('wei');
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
              timestamp: moment().unix(),
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
textarea:focus, input:focus{
    outline: none;
}
.model-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.model-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.model-container {
  display: flex;
  flex-direction: column;
  width: 390px;
}
.model-close {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.model-close-btn {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
.model-content {
  width: 350px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  background-color: #ffffff;
  padding-top: 25px;
  padding-bottom: 20px;
}
.model-content-title {
  font-size: 20px;
  font-weight: bold;
font-family: "Titillium Web", sans-serif;
  margin-bottom: 0px;
}
.model-content-subTitle {
  font-size: 12px;
  color: #86929d;
  font-family: Roboto;
  margin-bottom: 0px;
}
.model-line {
  width: 100%;
  height: 1px;
  background-color: #f4f6f8;
  margin-top: 20px;
}
.model-ton-stake {
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.model-ton-stake-input {
  border: none;
  width: 22px;
  min-width: 22px;
  max-width: 184px;
  height: 50px;
  font-size: 38px;
  color: #304156;
  font-family: Roboto;
  font-weight: 500;
}
.model-ton-stake-input-blink {
  border-bottom: solid 2px #2a72e5;
  animation: blink 1s;
  animation-iteration-count: infinite;
}
@keyframes blink { 50% { border-color:#fff ; }  }
.model-ton-stake-btn {
  width: 56px;
  height: 25px;
  border-radius: 4px;
  border: solid 1px #dfe4ee;
  background-color: #ffffff;
  font-size: 12px;
  color: #86929d;
  cursor: pointer;
  position: fixed;
  margin-left: 250px;
}
.model-ton-balance {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 75px;
}
.model-ton-balance-title {
  font-size: 12px;
  color: #808992;
  font-weight: 500;
  margin-bottom: 0;
}
.model-ton-balance-amount {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #3d495d;
  font-weight: 500;
}
.model-description {
  font-size: 12px;
  font-weight: 500;
  color: #2a72e5;
  margin-top: 25px;
  margin-bottom: 25px;
}
.model-btn {
  width: 150px;
  height: 38px;
  border-radius: 4px;
  background-color: #257eee;
  color: #ffffff;
  border: none;
  cursor: pointer;
}
.model-btn-notavailable {
  background-color: #e9edf1;
  cursor: default;
}
.model-line-bottom {
  margin-bottom: 17px;
}
</style>
