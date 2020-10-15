<template>
  <div class="home-layout">
    <div class="home-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <div class="page-header">Stake tokens now!!</div>
      <div class="page-text">Stake your TON to earn Power TON and other rewards</div>
      <div class="balance-container">
        <div class="ton-balance">
          <SwapComponent title="Your TON Balance" :balance="tonBalance | currencyAmount" rewards="Power TON Balance" :value="currencyAmount(power)" />
        </div>
        <div class="ton-balance">
          <SwapComponent title="Total Staked TON" :balance="userTotalStaked | currencyAmount" rewards="Expected Rewards" :value="currencyAmount(userTotalSeigs)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SwapComponent from '@/components/SwapComponent.vue';
import { mapState, mapGetters } from 'vuex';
// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

export default {
  components: {
    SwapComponent,
  },
  computed: {
    ...mapState([
      'user',
      'networkId',
      'tonBalance',
      'blockNumber',
      'power',
    ]),
    ...mapGetters([
      'userTotalStaked',
      'userTotalSeigs',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
};
</script>
<style scoped>
.home-layout {
    min-width: 1200px;
    max-width: 1200px;
    display: flex;
    /* align-items: center; */
    justify-content: center;
}
.home-content {
    display: flex;
    flex-direction: column;
     align-items: center;
     width: 850px;

}
.logo {
    height: 100px;
    width: 144px;
}
.page-header {
    margin-top: 10px;
    margin-bottom: 15px;
    font-family: cursive;
    color: #555555;
    font-size: 36px;
    text-align: center;
    font-weight: 700;
    padding: 0px;
}
.page-text{
    margin-bottom: 30px;
    color: #8c8c8c;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
 }
.balance-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 660px;
}

</style>
