<template>
  <div>
    <div class="title">Un-stake</div>

    <div class="image-container">
      <img class="screenshot" src="@/assets/images/support/unstake_01.png">
      <img class="screenshot" src="@/assets/images/support/unstake_02.png">
    </div>

    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Press the Unstake button. Popup will appear</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Writing down the quantity of TON to unstake.
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Click ‘Unstake’ button
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Check the connected metamask
      </li>
    </ol>
    <ul>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Not Withdrawable
        : If you unstake a staked TON, it is the quantity of TON in Not Withdraw for the period set by the operator. (Default is 93046 blocks, approximately 2 weeks)
      </li>
    </ul>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
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
  margin-top: 40px;
}
.subtitle {
  font-family: Roboto;
  font-size: 18px;
  font-weight: 700;
  color: #3d495d;
}
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
.mini-subtitle {
  font: Roboto;
  font-size: 18px;
  color: #2a72e5;
  font-weight: normal;
}
.link {
  font-family: Roboto;
  font-size: 17px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.41;
  letter-spacing: 0.34px;
  text-align: left;
  color: #2a72e5;
}
.image-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
