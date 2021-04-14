<template>
  <div>
    <div class="title">Stake</div>

    <h4 class="mini-subtitle">What is Stake? </h4>
    <ul>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">It means to divide the profits of staking by delegating TON to the operator that is already in operation.</li>
    </ul>

    <div class="image-container image" :style="{marginTop: '90px', marginBottom: '40px'}">
      <img class="screenshot" src="@/assets/images/support/stake_1.png">
    </div>

    <h4 class="mini-subtitle">Select Operator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Select the operator you want to delegate from the Operator list</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        if you click 1(unfold) button, you can see the information of operators( Total Delegates, Pending Withdrawal, Recent Commit, Commit Count, Staking history, Commit history)
      </li>
    </ol>

    <div class="image-container image" :style="{marginTop: '90px', marginBottom: '40px'}">
      <img :style="{width: '50%'}" src="@/assets/images/support/stake_2.png">
      <img class="rightImage" :style="{width: '50%'}" src="@/assets/images/support/stake_3.png">
    </div>

    <h4 class="mini-subtitle">02. Stake TON to Operator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Press the Stake button. Popup will appear</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> writing down the quantity of TON to delegate. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Click ‘Stake’ button</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> if you want to close popup, click ‘X’ button</li>

      <ul>
        <li class="description" style="margin-left:-10px; margin-bottom:10px">
          Once  staked, there will be a delay for the duration set by the operator upon withdrawal request.
          (Default is 93046 blocks, approximately 2 weeks)
        </li>
      </ul>


      <div class="image-container" :style="{marginTop: '40px', marginBottom: '40px'}">
        <img class="image" src="@/assets/images/support/stake_4.png">
      </div>

      <li class="description" style="margin-left:-10px; margin-bottom:10px">Click ‘Confirm’ button</li>
    </ol>
    <ul>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Once  staked, there will be a delay for the duration set by the operator upon withdrawal request.
        (Default is 93046 blocks, approximately 2 weeks)
      </li>
    </ul>

    <div class="image-container image" :style="{marginTop: '90px', marginBottom: '40px'}">
      <img class="image" :style="{width: '50%'}" src="@/assets/images/support/stake_5.png">
      <img class="rightImage" :style="{width: '50%'}" src="@/assets/images/support/stake_6.png">
    </div>

    <h4 class="mini-subtitle">03. Staking Calculator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Press the Simulator button. Popup will appear</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> writing down the quantity of TON to you want to stake. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Select duration you want to stkae</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Click ‘Calculate’ button</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> if you want to close popup, click ‘X’ button</li>


      <div class="image-container" :style="{marginTop: '40px', marginBottom: '40px'}">
        <img class="image" src="@/assets/images/support/stake_07.png">
      </div>

      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Estimated amount of TONs you earn
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Value of estimated amount of TONs and APY </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Click ‘Stake’ button .if you click staking popup will appear</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> if you want to recalculate, click ‘Recalculate’ button</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> if you want to close popup, click ‘X’ button</li>
    </ol>
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
.image {
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
.rightImage {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
