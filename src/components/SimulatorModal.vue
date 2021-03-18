<template>
<div class="model-wrapper">
  <div class="simulator-container">
    <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closePopup()"
        >
      </div>
      <div class="model-content">
    <div class="model-content-title">Staking Simulator</div>
    <div class="model-content-subTitle">Calculate how much TON you can earn</div>
      <div class="model-line" />
      <div class="model-second-container">
        <div class="row">
          <div class="simulator-text">Stake</div>
          <div style="display:flex; flex-direction:row; height: 32px;">
          <div class="input-container">
            <input v-model="myStaked" @keypress="isNumber">
            <div class="ton-text"> TON </div>
          </div>
          <button>MAX</button>
          </div>
        </div>
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
    </div>
    <button @click="calculate">calculate</button>
  </div>
  </div>
</div>
</template>
<script>
import axios from 'axios';
import { mapState } from 'vuex';
export default {
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
    };
  },
  computed: {
    ...mapState([
      'tonBalance',
    ])
  },
  async created () {
    this.getTotalSupply();
    this.getCurrentStakedAmount();
    this.getKRWPrice();
    this.getUSDInfo();
  },
  methods: {
    closePopup () {
      this.$emit('closePopup');
    },
    currencyChange (event) {
      this.currency = event.target.value;
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
      if (Number(this.myStaked) <= 0 || this.myStaked === '') {
        alert('Staked TON must be bigger than 0');
        return 'error';
      }
      this.getTotalSupply();
      let my = Number(this.myStaked);
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
      this.returnRate = (my/Number(this.myStaked)*100 - 100);

      const rewardPrice = this.expectedSeig;
      this.roi = this.returnRate.toLocaleString(undefined, { maximumFractionDigits:2 })+' %';
      this.rewardTON = this.expectedSeig.toLocaleString(undefined, { maximumFractionDigits:4 })+' TON ';
      this.rewardUSD = ' $ ' + (rewardPrice * USD).toLocaleString(undefined, { maximumFractionDigits:2 });
      this.rewardKRW = ' ₩ ' + (rewardPrice * KRW).toLocaleString(undefined, { maximumFractionDigits:0 });
      this.$emit('openResultModal', this.roi, this.rewardTON, this.rewardUSD, this.rewardKRW, this.myStaked);
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
.model-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.simulator-container {
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
height: 323px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  background-color: #ffffff;
  padding-top: 25px;
  padding-bottom: 20px;
}
.model-content-title {
font-family: "Titillium Web", sans-serif;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.5px;
  text-align: center;
  color: #3d495d;
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
.model-second-container {
  width: 290px;
  padding: 25px 30px 24px 30px;
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 55px;
}
.simulator-text {
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.14;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
}
.input-container {
   border: solid 1px;
  border-color: #dfe4ee;
  display: flex;
  flex-direction: row;
  padding: 7px 10px;
  width: 120px;
  margin-right: 5px;
}
input {
  border: none;
  width: 100%;
}
.ton-text {
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: right;
  color: #3e495c;
}
</style>
