<template>
  <div class="operator-container">
    <a class="information" target="_blank"
       rel="noopener noreferrer"
       href="https://staking.tokamak.network/"
    >More Information</a>
    <div class="operator-title">
      <avatar class="avatar" fullname="O P R" :image="filteredImgURL(operator.avatar)" :size="50" :color="operator.color" />
      <div class="operator-name">{{ operator.name }}</div>
      <div style="font-size: 14px">Stake TON to earn rewards</div>
      <div class="commission-rate-container">
        <div>Commission Rate</div>
        <div>{{ operator.isCommissionRateNegative ? '-' : '' }}{{ rateOf(operator.commissionRate) }}</div>
      </div>
      <button class="select-button">Select</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getConfig } from '../../config.js';

import Avatar from 'vue-avatar-component';
export default {
  components: {
    'avatar': Avatar,
  },
  props:{
    layer2: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapState([
      'user',
      'DepositManager',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    filteredImgURL () {
      return name => name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    fromNow () {
      return (timestamp, suffix = false) => this.$options.filters.fromNow(timestamp, suffix);
    },
    rateOf () {
      return commissionRate => this.$options.filters.rateOf(commissionRate);
    },
  },
};
</script>

<style scoped>
.operator-container {
  padding: 10px;
  width: 280px;
  background-color:#e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
}
.information {
    text-decoration: none;
    color: #555555;
    display: flex;
    float: right;
   /* justify-content:flex-end; */
   font-size: 10px;
   padding: 5px;
   background: #e2e2e2;
   border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
}
.operator-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5px;
    width: 100%;
    color: #555555;
}
.operator-name {
    font-size: 23px;
    font-weight: 700;
    padding: 10px;
}
.avatar {
    margin-top: -5px;

}
.commission-rate-container {
    background-color: white;
    width: 90%;
    border-radius: 12px;
    padding: 0px 15px;
    margin: 20px 5px 20px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 14px;
}
.select-button {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: none;
    background:  #2a72e5;
    color: #e2e2e2;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
}
button:focus {
  outline: none;
}
button:hover {
  color: #555555;
}
</style>
