<template>
  <div>
    <div class="image-container">
      <img class="screenshot" src="@/assets/images/wallet_screenshot.png">
    </div>
    <p class="description">
      1) <strong>Total Staked:</strong> Sum of your total staked.
    </p>
    <p class="description">
      2) <strong>Pending Withdrawal:</strong> Sum of your undstake request amount. However, Unstaked TONs can be withdrawn after the period set by the operator. (Default is 93046 blocks, approximately 2 weeks).
    </p>
    <p class="description">
      3) <strong>Total Accumulated Reward:</strong>  Sum of your reward during all time.
    </p>
    <p class="description">
      4) <strong>Power:</strong> Probability of winning Power TON round.
    </p>
    <p class="description">
      5) <strong>Reward:</strong> Amount of TONs you earn. It gives you a choice to select period
    </p>
    <p class="description">
      6) <strong>Analysis of Reward</strong>
      <ul>
        <li><strong>Total Reward:</strong> Sum of your reward  during that period.</li>
        <li><strong>Total Staked:</strong> Sum of your staked during that period.</li>
        <li><strong>Total Withdraw:</strong> Sum of your withdrawed during that period.</li>
      </ul>
    </p>
    <p class="description">
      7) <strong>History:</strong> History of your transaction (Transaction Hash, Operator Contract, Type, Amount, Block Number, Status)
    </p>
  </div>
</template>

<script>
export default {

};
</script>

<style>
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
.image-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.screenshot {
    width: 100%;
    height: 100%;
}
</style>
