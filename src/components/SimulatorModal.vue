<template>
  <div class="simulator-container">
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
  </div>
</template>
<script>
import axios from 'axios';
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
.simulator-container {
  background: #ffffff;
  height: 300px;
  width: 200px;
}
</style>
