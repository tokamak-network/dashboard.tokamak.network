<template>
  <div class="model-wrapper">
    <div class="model-container">
      <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closeModal('withdraw')"
        >
      </div>
      <div class="model-content">
        <h1 class="model-content-title">Withdraw</h1>
        <h2 class="model-content-subTitle">Do you really want to withdraw your TON now?</h2>
        <div class="model-line" />
        <div class="model-ton-stake">
          <span class="model-ton-stake-amount">{{
            getMaxBalance()
          }}</span>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Staked Balance</h3>
          <span class="model-ton-balance-amount">{{ operator.userStaked | currencyAmount }}</span>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Withdrawable Balance</h3>
          <span class="model-ton-balance-amount">{{
            getMaxBalance()
          }}</span>
        </div>
        <div class="model-line model-line-bottom" />
        <span class="model-description">Withdrawal delay is about 2 weeks</span>
        <button
          class="model-btn"
          :class="{
            'model-btn-notavailable':
              operator.userWithdrawable | (currencyAmountWithoutUnit === '0') ||
              operator.userWithdrawable | (currencyAmountWithoutUnit === ''),
          }"
          @click="withdraw"
        >
          Withdraw
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="model-container">
    <button @click="closeModal('withdraw')">X</button>
    <div>Withdraw</div>
    <div>Do you really want to withdraw your tokens now?</div>
    <div>{{ availableAmountToWithdraw | currencyAmount }}</div>
    <button @click="setAvailableAmountToWithdraw">MAX</button>
    <div>Available Balance</div>
    <div>{{ operator.userWithdrawable | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="withdraw">Withdraw</button>
  </div> -->
</template>
<script>
import Vue from 'vue';
import { mapState, mapGetters } from 'vuex';
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
  },
  data () {
    return {
      availableAmountToWithdraw: 0,
      inputTon: '0',
      withDrawableAmount: 0,
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
    ...mapGetters(['operatorByLayer2']),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    currencyAmountWithoutUnit () {
      return (amount) => this.$options.filters.currencyAmountWithoutUnit(amount);
    },
  },
  methods: {
    getMaxBalance (args) {
      let afterDecimalNumber;
      const tonAmount = this.operator.userWithdrawable.toBigNumber().toString();
      const spliedTonAmount = tonAmount.split('.');
      const beforeDecimalNumber = spliedTonAmount[0];
      if(spliedTonAmount[1] === undefined) {
        afterDecimalNumber = '00';
      } else {
        afterDecimalNumber = spliedTonAmount[1].slice(0, 2);
      }
      if(args === 'max') {
        return this.inputTon = `${beforeDecimalNumber}.${afterDecimalNumber}`;
      }
      return `${beforeDecimalNumber}.${afterDecimalNumber}`;
    },
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
      this.DepositManager.methods
        .processRequests(this.operator.layer2, count, true)
        .send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Withdrawn',
            amount: amount,
            transactionHash: hash,
            target: this.operator.layer2,
            timestamp: moment().unix(),

          };
          this.$store.dispatch('addPendingTransaction', transcation);
          this.$store.commit('SET_PENDING_TX', hash);
        })
        .on('receipt', async (receipt) => {
          this.index = 0;
        })
        .on('confirmation', async (confirmationNumber) => {
          if (confirmationNumber === 0) {
            this.$store.commit('SET_PENDING_TX', '');
          }
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
  height: 360px;
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
.model-ton-stake-amount {
  font-size: 38px;
  color: #304156;
  font-weight: 500;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 82.8%;
  height: 55px;
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
}
.model-line-bottom {
  margin-bottom: 25px;
}
</style>
