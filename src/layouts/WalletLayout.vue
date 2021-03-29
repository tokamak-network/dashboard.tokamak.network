<template>
  <div class="wallet-layout">
    <div class="wallet-title-container">
      <h1>Wallet</h1>
      <h2>Check the status of your assets in the wallet</h2>
    </div>
    <div class="wallet-current">
      <ValueView :title="'Cuurent Staked'" :value="currencyAmount(userTotalStaked).toString().replace('TON', '')" :ton="true" />
      <ValueView :title="'Pending Withdrawal'" :value="currencyAmount(userTotalWithdrawable).toString().replace('TON', '')" :ton="true" />
      <ValueView :title="'Total Accumulated Reward'" :value="currencyAmount(reward).toString().replace('TON', '')" :ton="true" />
      <div class="wallet-current-detail">
        <h3>Power</h3>
        <span class="wallet-current-detail-content">{{ currencyAmount(power).replace('POWER', '') }} <span class="wallet-current-detail-span">POWER </span><span class="wallet-current-detail-span" style="color: #2a72e5">({{ currentRound.winningProbability }})</span></span>
      </div>
    </div>
    <wallet-graph :options="options" :dailyWalletRewardsList="dailyWalletRewardsList" />
    <div class="table-container">
      <div style="margin-bottom: 20px;">History</div>
      <WalletHistoryTable />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import ValueView from '@/components/ValueView.vue';
import { getAccumulatedReward } from '@/api';
import { createCurrency } from '@makerdao/currency';
import WalletHistoryTable from '@/components/table/WalletHistoryTable.vue';
import WalletGraph from '@/containers/WalletGraph.vue';
const _WTON = createCurrency('WTON');

export default {
  components: {
    ValueView,
    WalletHistoryTable,
    WalletGraph,
  },
  data () {
    return {
      reward: 0,
      walletTotalStaked: {},
      dailyWalletRewards: {},
      dailyWalletRewardsList: [],
      chartType: 'week',
      weekLabels: ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 05'],
      monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      yearLabels: [],
      options: {},
    };
  },
  computed: {
    ...mapState([
      'operators',
      'power',
      'user',
      'networkId',
      'currentRound',
      'signIn',
    ]),
    ...mapGetters([
      'userTotalStaked',
      'userTotalSeigs',
      'userTotalWithdrawable',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  created () {
    this.getAccumulatedReward();
    // this.getDailyWalletRewardsFn(this.weekLabels);
  },
  methods:{
    async getAccumulatedReward () {
      if(this.signIn) {
        const reward = await getAccumulatedReward(this.networkId, this.user.toLowerCase());
        const rewarded =  (reward[0].rewards).toLocaleString('fullwide', { useGrouping:false });
        this.reward = _WTON.ray(rewarded.toString());
      }
    },
    displayAmount (amount) {
      const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
      return Math.round(displayAmounts * 10) / 10;
    },
  },
};
</script>
<style scoped>
.wallet-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 70px;
}
.wallet-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wallet-title-container h1 {
  font-family: "NanumSquare", sans-serif;
  font-size: 38px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  margin-bottom: 15px;
}
.wallet-title-container h2 {
  font-family: "Titillium Web", sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.4px;
  text-align: center;
  color: #808992;
  margin-bottom: 60px;
}
.wallet-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.wallet-current-detail {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 51px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(96, 97, 112, 0.16);
  border-radius: 10px;
  margin-left: 30px;
  padding-top: 18px;
  padding-bottom: 15px;
}

.wallet-current-detail h3 {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: center;
  color: #808992;
  margin-bottom: 7px;
}
.wallet-current-detail-content {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: right;
  color: #304156;
}
.wallet-current-detail-span {
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
}

.chart-container {
  height: 51px;
}

.table-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.11;
  letter-spacing: 0.45px;
  text-align: center;
  color: #3d495d;
}
</style>
