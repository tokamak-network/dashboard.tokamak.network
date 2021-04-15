<template>
  <div>
    <div class="title">Stake</div>

    <div class="image-container">
      <img class="screenshot" src="@/assets/images/support/stake_1.png">
    </div>

    <h4 class="mini-subtitle">Select Operator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Select the operator you want to delegate from the Operator list by clicking the unfold button. You can see information of operators such as Total Delegates, Pending Withdrawal, Recent Commit, Commit Count, Staking history, and Commit history.</li>
    </ol>

    <div class="image-container" :style="{marginTop: '90px', marginBottom: '40px'}">
      <img class="image" :style="{height: '345px'}" src="@/assets/images/support/stake_2.png">
      <img class="image" :style="{height: '345px'}" src="@/assets/images/support/stake_3.png">
      <img class="image" src="@/assets/images/support/stake_4.png">
    </div>

    <h4 class="mini-subtitle">02. Stake TON to Operator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Press the Stake button and a popup will appear.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Insert the amount of TON to stake. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Click the <strong>Stake</strong> button.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> If you want to close the popup, click the <strong>X</strong> button.</li>

      <ul>
        <li class="description" style="margin-left:-10px; margin-bottom:10px">
          Once  staked, there will be a delay for the duration set by the operator upon withdrawal request.
          (Default is 93046 blocks, approximately 2 weeks)
        </li>
      </ul>

      <li class="description" style="margin-left:-10px; margin-bottom:10px">
       Click the confirm button of the Metamask popup that will open from the Metamask extension of your browswer.

        <ul>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            Once  staked, there will be a delay for the duration set by the operator upon withdrawal request.
            (Default is 93046 blocks, approximately 2 weeks)
          </li>
        </ul>
      </li>
    </ol>

    <div class="image-container" :style="{marginTop: '90px', marginBottom: '40px'}">
      <img class="image" src="@/assets/images/support/stake_5.png">
      <img class="image" src="@/assets/images/support/stake_6.png">
      <img class="image" src="@/assets/images/support/stake_7.png">
    </div>

    <h4 class="mini-subtitle">03. Staking Calculator</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Press the Simulator button and a popup will appear.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Insert the amount of TON to stake. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Select duration you want to stkae.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> Click the <strong>Calculate</strong> button.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> If you want to close popup, click the <strong>X</strong> button.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Estimated amount of TONs you will earn during the selected period will appear here.
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> The USD value, the APY, and the KRW value of the amount of TON you will earn will appear here.   </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        If you click the <strong>Stake</strong> button, the staking popup will appear.
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> If you want to recalculate, click the <strong>Recalculate</strong> button.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> If you want to close popup, click <strong>X</strong> button.</li>
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
  justify-content: space-around;
}
.image {
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
.leftImage {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.rightImage {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.screenshot {
  width: 100%;
  height: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
 box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
</style>
