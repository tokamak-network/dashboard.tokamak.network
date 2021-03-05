<template>
  <div class="wallet-layout">
    <div class="wallet-container">
      <div class="wallet-wrapper">
        <h4>Wallet Details</h4>
        <div class="wallet-stats">
          <div class="wallet-stats__title">Total Staked</div>
          <div class="wallet-stats__count">100 TON</div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Pending Withdrawal</div>
          <div class="wallet-stats__count">100 TON</div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Total Accumulated Reward</div>
          <div class="wallet-stats__count">100 TON</div>
        </div><div class="wallet-stats-wrapper">
          <div class="wallet-stats__title">Power</div>
          <div class="wallet-stats__count">100 TON (probability win)</div>
        </div>
      </div>
      <div class="wallet-body">
        <h4>Reward</h4>

        <div class="wallet-body__information">
          <div class="wallet-body--analysis">
            <div>Analysis of Reward</div>
            <div>Total Reward: 10, 000</div>
            <div>Total Staked: 100, 000</div>
            <div>Total withdraw: 0</div>
          </div>
        </div>
      </div>

      <div class="wallet-footer">
        <h4>History</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>TX Hash</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {

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
</style>
