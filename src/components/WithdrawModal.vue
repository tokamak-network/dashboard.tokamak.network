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
          <!-- <input
            id="inputTonFiled"
            v-model="inputTon"
            class="model-ton-stake-input"
            :class="{'model-ton-stake-input-blink' : inputTon === '0' || inputTon === ''}"
            value="0"
            step="0.01"
            :style="{width: (inputTon.length * 22) + 'px'}"
            @keypress="onlyForTon"
          > -->
          <button class="model-ton-stake-btn" @click="makeInputMax">MAX</button>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Staked Balance</h3>
          <span class="model-ton-balance-amount">{{ operator.userStaked | currencyAmount }}</span>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Withdrawable Balance</h3>
          <span class="model-ton-balance-amount">{{ operator.userWithdrawable + ' TON' }}</span>
        </div>
        <div class="model-line model-line-bottom" />
        <button class="model-btn"
                :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                click="withdraw"
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
  watch: {
    inputTon: function (newValue) {
      let result;
      if(newValue === '.') {
        result = newValue;
      } else {
        result = newValue.replace(/[^0-9a-zA-Z.]/g, '')
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      Vue.nextTick(() => this.inputTon = result);
    },
  },
  methods:{
    makeInputMax () {
      const tonAmount = this.availableAmountToWithdraw.toBigNumber().toString();
      const spliedTonAmount = tonAmount.split('.');
      const beforeDecimalNumber = spliedTonAmount[0];
      const afterDecimalNumber = spliedTonAmount[1].slice(0, 2);
      if(afterDecimalNumber[1] < 5 || afterDecimalNumber[1] === undefined) {
        return this.inputTon = `${beforeDecimalNumber}.${afterDecimalNumber[0]}0`;
      }
      return this.inputTon = `${beforeDecimalNumber}.${Number(afterDecimalNumber[0]) + 1}0`;
    },
    onlyForTon ($event) {
      // console.log($event.keyCode); //keyCodes value
      const keyCode = ($event.keyCode ? $event.keyCode : $event.which);

      // only allow number and one dot
      if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.inputTon.indexOf('.') !== -1)) { // 46 is dot
        $event.preventDefault();
      }

      // restrict to 2 decimal places
      if(this.inputTon!=null && this.inputTon.indexOf('.')>-1 && (this.inputTon.split('.')[1].length > 1)){
        $event.preventDefault();
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
textarea:focus, input:focus, button:focus{
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
