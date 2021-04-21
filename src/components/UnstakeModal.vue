<template>
  <div class="model-wrapper">
    <div class="model-container">
      <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closeModal('unstake')"
        >
      </div>
      <div class="model-content">
        <h1 class="model-content-title">Unstake</h1>
        <h2 class="model-content-subTitle">
          Do you really want unstake your TON now?
        </h2>
        <div class="model-line" />
        <div class="model-ton-stake">
          <input
            id="inputTonFiled"
            v-model="inputTon"
            class="model-ton-stake-input"
            :class="{
              'model-ton-stake-input-blink':
                inputTon === '0' || inputTon === '',
            }"
            value="0"
            :style="{ width: inputTon.length * 22 + 'px' }"
            @keypress="onlyForTon"
          >
          <button class="model-ton-stake-btn" @click="getMaxBalance('max')">MAX</button>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Available Balance</h3>
          <div class="model-ton-balance-amount">
            <span class="model-ton-balance-amount-number">
              {{ getMaxBalance() }}
            </span>
          </div>
        </div>
        <div class="model-line model-line-bottom" />
        <div class="model-bottom-wrap">
          <div class="model-bottom-container">
            <span v-if="warn" class="model-warn">Operator must have 1,000 TON </span>
            <span v-if="warn" class="model-warn">as an minumum amount</span>
          </div>
          <button class="model-btn"
                  :class="getInableStyle('class')"
                  :disabled="getInableStyle('disabled')"
                  @click="undelegate()"
          >
            Unstake
          </button>
        </div>

        <!-- <div>{{ availableAmountToDelegate | currencyAmount }}</div> -->
        <!-- <input v-model="availableAmountToDelegate" @keypress="isNumber">
        <div>Available Balance</div>
        <div>{{ tonBalance | currencyAmount }}</div> -->
      </div>
    </div>
  </div>
  <!-- <div class="model-container">
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
  </div> -->
</template>
<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';
import moment from 'moment';
import Decimal from 'decimal.js';
const { ethers } = require('ethers');
const BigNumber = ethers.BigNumber;
const _WTON = createCurrency('WTON');
const utils = ethers.utils;

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
      inputTon: '0',
      warn: false,
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
    ...mapGetters(['operatorByLayer2']),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
  },
  watch: {
    inputTon: function (newValue) {
      let result;
      if(newValue.length > 0 && this.inputTon.substring(0, 1) === '0') {
        if(newValue.split('.').length > 1) {
          return this.inputTon = newValue;
        }
        return this.inputTon = this.inputTon.substring(1, 2);
      }
      if (newValue === '.') {
        result = newValue;
      } else {
        result = newValue
          .replace(/[^0-9a-zA-Z.]/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      Vue.nextTick(() => (this.inputTon = result));
    },
  },
  methods: {
    round (str, maxDecimalDigits) {
      const num = new Decimal(str);
      return num.toFixed(maxDecimalDigits, Decimal.ROUND_CEIL);
    },
    getInableStyle (args) {
      const tonAmount = this.inputTon.replace(/,/g, '');
      switch(args) {
      case 'class':
        if(this.inputTon === '0' || this.inputTon === '0.' || this.inputTon === '0.0' || this.inputTon === '0.00' || this.inputTon === '' || Number(tonAmount) > Number(this.getMaxBalance()) || this.warn === true) {
          return 'model-btn-notavailable';
        }
        break;
      case 'disabled':
        if(this.inputTon === '0' || this.inputTon === '0.' || this.inputTon === '0.0' || this.inputTon === '0.00' || this.inputTon === '' || tonAmount > this.getMaxBalance() || this.warn === true) {
          return true;
        }
        break;
      }
    },
    getMaxBalance (args) {
      const tonAmount =  this.operator.userStaked.toBigNumber().toString();
      const num = new Decimal(tonAmount);
      if(args === 'max') {
        return this.inputTon = num.toFixed(2, Decimal.ROUND_CEIL);
      }
      return num.toFixed(2, Decimal.ROUND_CEIL);
    },
    onlyForTon ($event) {
      // console.log($event.keyCode); //keyCodes value
      const keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.inputTon.indexOf('.') !== -1)
      ) {
        // 46 is dot
        $event.preventDefault();
      }
      // restrict to 2 decimal places
      if (
        this.inputTon != null &&
        this.inputTon.indexOf('.') > -1 &&
        this.inputTon.split('.')[1].length > 1
      ) {
        $event.preventDefault();
      }
    },
    undelegate () {
      if(this.user === this.operator.address) {
        const operatorStaked = _WTON(this.operator.userStaked).toFixed('ray');
        const minimumAmount = this.operator.minimumAmount;
        const unstakedAmount = this.inputTon.replace(/,/g, '');

        const operatorStakedBN = BigNumber.from(operatorStaked);
        const minimumAmountBN = BigNumber.from(minimumAmount);
        const unstakedAmountBN = utils.parseUnits(unstakedAmount, 27);

        if ((operatorStakedBN.sub(unstakedAmountBN)).lt(minimumAmountBN)) {
          return this.warn = true;
        }
      }
      let tonAmount = parseFloat(this.inputTon.replace(/,/g, ''));
      if(this.inputTon === this.getMaxBalance()) {
        tonAmount = this.operator.userStaked.toBigNumber().toString();
      }
      if (tonAmount === '' || parseFloat(tonAmount) === 0) {
        return alert('Please check input amount.');
      }
      if (this.inputTon > this.getMaxBalance()) {
        return alert('Please check your TON amount.');
      }
      const amount = _WTON(tonAmount).toFixed('ray');
      this.DepositManager.methods
        .requestWithdrawal(this.operator.layer2, amount)
        .send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Undelegated',
            amount: amount,
            transactionHash: hash,
            target: this.operator.layer2,
            timestamp: moment().unix(),
          };
          this.$emit('closePopup', 'unstake');
          this.$store.dispatch('addPendingTransaction', transcation);
          this.$store.commit('SET_PENDING_TX', hash);
        })
        .on('receipt', (receipt) => {
          this.index = 0;
        })
        .on('confirmation', async (confirmationNumber) => {
          if (confirmationNumber === 0) {
            this.$store.commit('SET_PENDING_TX', '');
          }
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
    isNumber (evt) {
      evt = evt ? evt : window.event;
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
textarea:focus,
input:focus,
button:focus {
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
@keyframes blink {
  50% {
    border-color: #fff;
  }
}
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
button:focus {
  outline: none;
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
}
.model-bottom-wrap {
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.model-bottom-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 15px;
  color: #2a72e5;
  font-size: 12px;
  font-weight: bold;
  font-family: Roboto;
}
.model-warn {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
