<template>
  <div class="wallet-layout">
    <div class="wallet-container">
      <div class="wallet-wrapper">
        <h4>Wallet Details</h4>
        <div class="wallet-stats">
          <div class="wallet-stats__title">Total Staked</div>
          <div class="wallet-stats__count">{{ userTotalStaked }}</div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Pending Withdrawal</div>
          <div class="wallet-stats__count">{{ userTotalWithdrawable }} </div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Total Accumulated Reward</div>
          <div class="wallet-stats__count">{{ currencyAmount(userTotalSeigs) }}</div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Power</div>
          <div class="wallet-stats__count">{{ currencyAmount(power) }} (probability win)</div>
        </div>
      </div>
      <div class="wallet-body">
        <h4>Reward</h4>

        <line-chart
          :chartData="data"
          :width="500"
          :height="200"
        />


        <div class="wallet-body__information">
          <div class="wallet-body--analysis">
            <div>Analysis of Reward</div>
            <div>Total Reward: {{ userTotalReward }}</div>
            <div>Total Staked: {{ userTotalStaked }}</div>
            <div>Total withdraw: {{ userTotalWithdrawable }}</div>
          </div>
        </div>
      </div>

      <div class="wallet-footer">
        <h4>History</h4>
      </div>

      <table class="wallet-history-table">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center pointer">TX Hash</th>
            <th class="text-center pointer">Type</th>
            <th class="text-center pointer">Amount</th>
            <th class="text-center pointer">Block Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(recentTransaction, index) in recentTransactions" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ recentTransaction.transactionHash }}</td>
            <td class="text-center">{{ recentTransaction.type }} </td>
            <td class="text-center">{{ recentTransaction.amount | currencyAmount }} </td>
            <td class="text-center">{{ recentTransaction.blockNumber }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LineChart from '@/components/LineChart.vue';

export default {
  components: {
    LineChart,
  },
  data () {
    return {
      columns: [
        { name: 'Tx Hash', key: 'transactionHash' },
        { name: 'Type', key: 'type' },
        { name: 'Amount', key: 'amount' },
        { name: 'Block Number', key: 'blockNumber' } ],
    };
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
      'recentTransactions',
      'userTotalWithdrawable',
      'userTotalReward',
      'userTotalSeigs',
      'userTotalReward',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    hexSlicer () {
      return address => this.$options.filters.hexSlicer(address, 20);
    },
  },
};
</script>

<style scoped>
.wallet-layout {
    display: flex;
    width: 100vw;
    justify-content: center;
}
.wallet-container {
    display: flex;
    flex-direction: column;
    width: 70vw;
}

.wallet-wrapper {
    display: flex;
    justify-content: space-between;
}

.text-center {
  text-align: center;
}

.wallet-history-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.wallet-history-table td, .wallet-history-table th {
  border-top: solid 1px #dce2e5;
}

tbody tr:hover {
  background-color: #f8f8f8;
}

.pointer {
  cursor: pointer;
}

tbody .clickable {
  font-weight: bolder;
  text-decoration: underline;
}

.wallet-history-table th {
  text-align: left;
}

.wallet-history-table td {
  text-align: left;
}

.wallet-history-table .text-center {
  text-align: center;
}

.wallet-history-table .text-right {
  text-align: right;
}

th {
  padding: 6px;
  background-color: #f6f8f9;
  font-family: "Noto Sans",sans-serif;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7e8d93;
}

td {
  padding: 12px;
  font-family: "Noto Sans",sans-serif;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #161819;
}

.link {
  color: black;
}

.wallet-body__information {
  border-radius: 1rem;
  border: 1px solid #7e8d93;
  width: 10rem;
  padding: 2rem;
}
</style>
