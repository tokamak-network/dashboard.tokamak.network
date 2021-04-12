<template>
  <div>
    <div class="title">Stake</div>
    <h3 class="subtitle">01. Select Operator</h3>
    <p class="description">
      1) Select the operator you want to delegate from the Operator list
    </p>
    <p class="description">
      2) if you click 1(unfold) button, you can see the information of operators( Total Delegates, Pending Withdrawal, Recent Commit, Commit Count, Staking history, Commit history)
    </p>
    <h3 class="subtitle">02. Stake TON to Operator</h3>
    <p class="description">
      1) Press the Stake button. Popup will appear
    </p>
    <p class="description">
      2) writing down the quantity of TON to delegate.
    </p>
    <p class="description">
      3) Click ‘Stake’ button
    </p>
    <p class="description">
      4) if you want to close popup, click ‘X’ button
    </p>
    <p class="description">
      * Once  staked, there will be a delay for the duration set by the operator upon withdrawal request.
      (Default is 93046 blocks, approximately 2 weeks)
    </p>
    <p class="description">
      5) Click ‘Confirm’ button
    </p>
    <p class="description">
      * Once  staked, there will be a delay for the duration set by the operator upon withdrawal request. (Default is 93046 blocks, approximately 2 weeks)
    </p>
    <h3 class="subtitle">03. Staking Simulator</h3>
    <p class="description">
      1) Press the Simulator button. Popup will appear
    </p>
    <p class="description">
      2) writing down the quantity of TON to you want to stake.
    </p>
    <p class="description">
      3) Select duration you want to stkae
    </p>
    <p class="description">
      4) Click ‘Calculate’ button
    </p>
    <p class="description">
      5) if you want to close popup, click ‘X’ button
    </p>
    <p class="description">
      6) Estimated amount of TONs you earn
    </p>
    <p class="description">
      7) Value of estimated amount of TONs and APY
    </p>
    <p class="description">
      9) if you want to recalculate, click ‘Recalculate’ button
    </p>
    <p class="description">
      10) if you want to close popup, click ‘X’ button
    </p>
  </div>
</template>

<script>
export default {

};
</script>

<style>
.title {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.2px;
  text-align: left;
  color: #2a72e5;
  margin-bottom: 20px;
}
.subtitle {
  font-family: Roboto;
  font-size: 17px;
  font-weight: 700;
  color: #3d495d;
}
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
</style>
