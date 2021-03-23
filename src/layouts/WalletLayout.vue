<template>
  <div class="wallet-layout">
    <div class="wallet-title-container">
      <h1>Wallet</h1>
      <h2>Check the status of your assets in the wallet</h2>
    </div>
    <div class="wallet-current">
      <ValueView :title="'Total Staked'" :value="currencyAmount(userTotalStaked)" />
      <ValueView :title="'Pending Withdrawal'" :value="currencyAmount(userTotalWithdrawable)" />
      <ValueView :title="'Total Accumulated Reward'" :value="currencyAmount(reward)" />
      <ValueView :title="'POWER'" :value="currencyAmount(power)" />
    </div>
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
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

export default {
  components: {
    ValueView,
    WalletHistoryTable,
  },
  data () {
    return {
      reward: 0,
    };
  },
  computed: {
    ...mapState([
      'operators',
      'power',
      'user',
      'networkId',
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
  },
  methods:{
    async getAccumulatedReward () {
      const reward = await getAccumulatedReward(this.networkId, this.user.toLowerCase());
      const rewarded =  (reward[0].rewards).toLocaleString('fullwide', { useGrouping:false });
      this.reward = _WTON.ray(rewarded.toString());
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
  font-size: 36px;
  color: #3d495d;
  font-weight: 700;
  margin-bottom: 15px;
}
.wallet-title-container h2 {
  font-size: 16px;
  color: #808992;
  font-weight: normal;
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
