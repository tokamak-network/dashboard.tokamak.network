<template>
  <div>
    <div class="image-container">
      <img class="image" :style="{marginRight: '50px'}" src="@/assets/images/support/withdraw_01.png">
      <img class="image" src="@/assets/images/support/withdraw_02.png">
    </div>
    <div class="title">Withdraw</div>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Press the <strong>Withdraw </strong> button, popup will appear.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Click <strong>Withdraw</strong> button of the popup to withdraw all your TON at once.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Clock the <strong>Confirm</strong> button of the Metamask popup to confirm the transaction. </li>
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
  margin-top: 40px;
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
    margin-top: 90px;
    margin-bottom: 40px;
}

.screenshot {
  width: 50%;
  /* height: 30%; */
  margin: 30px;
}

.image {
  border-radius: 10px;
  box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
</style>
