<template>
  <div class="model-wrapper">
    <div v-if="currentView === 'calculate'" class="model-wrapper">
      <div class="model-container">
        <div class="model-close">
          <img
            class="model-close-btn"
            :src="require(`@/assets/images/popup-close-icon.svg`)"
            @click="closePopup()"
          >
        </div>
        <div class="model-content">
          <h1 class="model-content-title">Staking Simulator</h1>
          <h2 class="model-content-subTitle">Calculating how much you can earn</h2>
          <div class="model-line" />
          <div class="model-ton-balance">
            <h3 class="model-ton-balance-title">Stake</h3>
            <div class="model-ton-balance-inner">
              <input
                v-model="inputTon"
                class="model-ton-balance-input model-ton-balance-input-stake"
              >
              <button class="model-ton-stake-btn" @click="makeInputMax">MAX</button>
            </div>
          </div>
          <div class="model-ton-balance">
            <h3 class="model-ton-balance-title">Total Staked</h3>
            <div class="model-ton-total">
              <span class="model-ton-total-text">{{ totalStaked | current }}</span>
            </div>
          </div>
          <div class="model-ton-balance">
            <h3 class="model-ton-balance-title">Duration</h3>
            <select v-model="selected" class="model-ton-selectbox">
              <option>Year</option>
              <option>Month</option>
              <option>Week</option>
            </select>
          </div>
          <div class="model-line" />
          <button class="model-btn"
                  :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                  @click="calculate()"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
    <div v-else class="model-wrapper">
      <div class="model-container">
        <div class="model-close">
          <img
            class="model-close-btn"
            :src="require(`@/assets/images/popup-close-icon.svg`)"
            @click="closePopup()"
          >
        </div>
        <div class="model-content">
          <h1 class="model-content-title">Staking Simulator</h1>
          <h2 class="model-content-subTitle">
            Estimated reward of TON you can earn
          </h2>
          <div class="model-line" />
          <h2 class="model-description">You can earn about</h2>
          <div class="model-result-container">
            <div class="model-result-ton">
              <span class="model-result-ton-amount">{{ rewardTON }}</span>
              <span class="model-result-ton-type">TON</span>
            </div>
            <div class="model-result-detail">
              <span class="model-result-detail-info">{{ rewardUSD }}</span>
              <span class="model-result-detail-info">{{ roi }}</span>
              <span class="model-result-detail-info">{{ rewardKRW }}</span>
            </div>
          </div>
          <div class="model-line" />
          <div class="model-btn-container">
            <button class="model-btn"
                    :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                    style="marginRight: 5px"
                    @click="test()"
            >
              Stake
            </button>
            <button class="model-btn"
                    :class="{'model-btn-notavailable' : inputTon === '0' || inputTon === ''}"
                    @click="changeView('calculate')"
            >
              Recalculate
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="simulator-container">
    <button @click="closePopup()">X</button>
    <div>Staking Simulator</div>
    <div>Lorem ipsum dolor sit amet</div>
    <div>Stake</div>
    <input v-model="myStaked" @keypress="isNumber">
    <div>Total Staked</div>
    <div>{{ totalStaked }}</div>
    <div class="content-name">
      Duration
      <select v-model="durationUnit" class="unit-select" @change="onChange($event)">
        <option value="YEAR">YEAR</option>
        <option value="MONTH">MONTH</option>
        <option value="WEEK">WEEK</option>
      </select>
    </div>
    <button @click="calculate">calculate</button>
  </div> -->
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
export default {
  props: {
    func: { type: Function },
  },
  data () {
    return {
      maxCompensateTokenPerDay: '26027.39726',
      compensatePerDay: 0,
      pSeigDeduction: '40',
      myStaked: '',
      totalSupply: 40000000,
      currentPrice: 0,
      usd: 0,
      totalStaked: '0',
      durationUnit: 'YEAR',
      roi:0,
      rewardTON:0,
      rewardUSD:0,
      rewardKRW:0,
      inputTon: '0',
      selected: 'Year',
      currentView: 'result',
    };
  },
  async created () {
    this.getTotalSupply();
    this.getCurrentStakedAmount();
    this.getKRWPrice();
    this.getUSDInfo();
  },
  methods: {
    makeInputMax () {
      const tonAmount = this.tonBalance.toBigNumber().toString();
      this.inputTon = tonAmount;
      console.log(this.inputTon);
    },
    changeView (args) {
      this.currentView = args;
    },
    closePopup () {
      this.$emit('closePopup');
    },
    currencyChange (event) {
      this.currency = event.target.value;
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    onChange (event) {
      this.durationUnit = event.target.value;
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
    calculate () {
      if (Number(this.inputTon) <= 0 || this.inputTon === '') {
        alert('Staked TON must be bigger than 0');
        return 'error';
      }
      this.getTotalSupply();
      let my = Number(this.inputTon);
      let unit = 0;
      let stakedRatio = 0;
      const maxCompensate = Number(this.maxCompensateTokenPerDay);

      const total = Number(this.totalStaked) + my;
      if (this.durationUnit === 'YEAR') {
        unit = 365;
      } else if (this.durationUnit === 'MONTH') {
        unit = 30;
      } else {
        unit = 7;
      }
      const USD = this.currentPrice * this.usd;
      const KRW = this.currentPrice;
      stakedRatio = total/this.totalSupply;
      this.compensatePerDay = stakedRatio * this.maxCompensateTokenPerDay;

      const dailyNotMintedSeig = maxCompensate - maxCompensate*(total/this.totalSupply);
      const proportionalSeig = dailyNotMintedSeig * (this.pSeigDeduction / 100);

      this.expectedSeig = (my/total) * (Number(this.compensatePerDay) + proportionalSeig) * unit;
      my = my + this.expectedSeig;
      this.returnRate = (my/Number(this.inputTon)*100 - 100);

      const rewardPrice = this.expectedSeig;
      this.roi = this.returnRate.toLocaleString(undefined, { maximumFractionDigits:2 })+' %';
      this.rewardTON = this.expectedSeig.toLocaleString(undefined, { maximumFractionDigits:4 })+' TON ';
      this.rewardUSD = ' $ ' + (rewardPrice * USD).toLocaleString(undefined, { maximumFractionDigits:2 });
      this.rewardKRW = ' ₩ ' + (rewardPrice * KRW).toLocaleString(undefined, { maximumFractionDigits:0 });
      // this.$emit('openResultModal', this.roi, this.rewardTON, this.rewardUSD, this.rewardKRW, this.myStaked);
      console.log(this.roi, this.rewardTON, this.rewardUSD, this.rewardKRW, this.myStaked);
      return this.changeView('result');
    },
    getCurrentStakedAmount () {
      axios
        .get('https://price-api.tokamak.network/staking/current')
        .then((response) => {
          this.totalStaked = response.data.toString();
        });
    },
    getTotalSupply () {
      axios
        .get('https://price-api.tokamak.network/totalsupply')
        .then((response) => {
          this.totalSupply = response.data;
        });
    },
    async getKRWPrice () {
      await axios
        .get('https://api.upbit.com/v1/ticker?markets=KRW-TON')
        .then((response) => {
          this.currentPrice = JSON.parse(
            JSON.stringify(response.data).replace(/]|[[]/g, '')
          ).trade_price;
        });
    },
    getUSDInfo () {
      axios
        .get('https://api.frankfurter.app/latest?from=KRW')
        .then((response) => {
          this.usd = response.data.rates.USD;
        });
    },
    closeModal () {
      this.showResultModal = false;
    },
    openStake () {
      this.showResultModal = false;
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
  height: 330px;
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
  height: 32px;
  border-radius: 4px;
  border: solid 1px #dfe4ee;
  background-color: #ffffff;
  font-size: 12px;
  color: #86929d;
  cursor: pointer
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
  font-size: 14px;
  color: #3d495d;
  font-family: Roboto;
  font-weight: 500;
  margin: 0;
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
  font-size: 13px;
  font-weight: 500;
  color: #2a72e5;
  margin-top: 18px;
  margin-bottom: 30px;
}
.model-btn {
  width: 130px;
  height: 38px;
  border-radius: 4px;
  background-color: #257eee;
  color: #ffffff;
  border: none;
  cursor: pointer;
  margin-top: 25px;
}
.model-btn-notavailable {
  background-color: #e9edf1;
}
.model-ton-balance-inner {
  display: flex;
}
.model-ton-balance-input {
  border: 1px solid #dfe4ee;
  border-radius: 4px;
  height: 30px;
  padding: 0;
  width: 181px;
}
.model-ton-balance-input-stake {
  width: 120px;
  margin-right: 5px;
}
.model-ton-selectbox {
  width: 183px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dfe4ee;
  padding-left: 15px;
  padding-top: 2px;
  padding-right: 15px;
  font-size: 13px;
}
.model-ton-total {
  width: 183px;
  height: 32px;
  border: 1px solid #dfe4ee;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.model-ton-total-text {
  font-size: 13px;
  font-family: Roboto;
  margin-right: 10px;
}
.model-result-container {
  display: flex;
  flex-direction: column;
}
.model-result-ton {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.model-result-ton-amount {
  font-size: 32px;
  font-weight: 500;
  color: #304156;
  margin-right: 5px;
}
.model-result-ton-type {
  font-size: 13px;
  font-weight: 500;
  color: #3d495d;
}
.model-result-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.model-result-detail-info {
  font-size: 12px;
  color: #808992;
}
.model-btn-container {
  display: flex;
}
</style>
