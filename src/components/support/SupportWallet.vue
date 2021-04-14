<template>
  <div>
     <div class="image-container">
      <img class="wallet-screenshot" src="@/assets/images/wallet_screenshot.jpg">
    </div>
    <div class="title">Wallet</div>
    <p class="description">
      After connecting your wallet, you can access the following infromation about your assets in the Wallet page.
    </p>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Total Staked:</strong> Sum of your total staked.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> <strong>Pending Withdrawal:</strong> Sum of your unstaked request amount. However, Unstaked TON can only be withdrawn after a withdrawal delay period set by the operator (default is 93046 blocks, approximately 2 weeks).</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Total Accumulated Reward:</strong>  Sum of the reward you accumulated since you started staking.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Power:</strong> Amount of PowerTON you own and your probability of winning the next PowerTON round.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Reward:</strong> Amount of TON you earned over a given period. You can select your desired period. The graph will show your daily reward amounts during the selected period. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        <strong>Analysis of Reward</strong>
        <ul>
          <li><strong>Total Reward:</strong> Sum of your reward  during that period.</li>
          <li><strong>Total Staked:</strong> Sum of your staked during that period.</li>
          <li><strong>Total Withdraw:</strong> Sum of your withdrawed TON since you started staking.</li>
        </ul>
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>History:</strong> History of all your transactions. THe information includes Transaction Hash, Operator Contract, Type, Amount, Block Number and Status.</li>
    </ol>
  </div>
</template>

<script>
export default {

};
</script>

<style>
.title {
  font-family: Roboto;
  font-size: 22px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.2px;
  text-align: left;
  color: #2a72e5;
  margin-bottom: 20px;
}
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

.wallet-screenshot {
    width: 100%;
    height: 100%;
    margin-top: 70px;
  margin-bottom: 40px;
     box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);

}
</style>
