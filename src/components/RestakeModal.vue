<template>
  <div class="model-wrapper">
    <div class="model-container">
      <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closeModal('restake')"
        >
      </div>
      <div class="model-content">
        <h1 class="model-content-title">Re-stake</h1>
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
            @keypress="onlyForTon"
          >
          <button class="model-ton-stake-btn" @click="makeInputMax">MAX</button>
        </div>
        <div class="model-ton-balance">
          <h3 class="model-ton-balance-title">Ton Balance</h3>
          <div class="model-ton-balance-amount">
            <span class="model-ton-balance-amount-number">{{ redelegatableAmount | currencyAmount }}</span>
          </div>
        </div>
        <div class="model-line model-line-bottom" />
        <button class="model-btn"
                :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                click="redelegate"
        >
          Re-Stake
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="model-container">
    <button @click="closeModal('restake')">X</button>
    <div>Re-stake</div>
    <div>You can earn TON and Power</div>
    <div>Available Balance</div>
    <div>{{ redelegatableAmount | currencyAmount }}</div>
    <div>Minimum staking amount is 100</div>
    <button @click="redelegate">Re-stake</button>
  </div> -->
</template>
<script>
import Vue from 'vue';
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
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    makeInputMax () {
      const tonAmount = this.redelegatableAmount.toBigNumber().toString();
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
}
.model-line-bottom {
  margin-bottom: 17px;
}
</style>
