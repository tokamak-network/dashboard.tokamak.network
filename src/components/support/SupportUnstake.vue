<template>
  <div>
    <div class="title">Restake</div>
    <h3 class="subtitle">Restake TON</h3>
    <p class="description">
      1) Press the Unstake button. Popup will appear
    </p>
    <p class="description">
      2) Writing down the quantity of TON to unstake
    </p>
    <p class="description">
      3) Click ‘Unstake’ button
    </p>
    <p class="description">
      4) Check the connected metamask
    </p>
    <p class="description">
      * Not Withdrawable
      : If you unstake a staked TON, it is the quantity of TON in Not Withdraw for the period set by the operator. (Default is 93046 blocks, approximately 2 weeks)
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
