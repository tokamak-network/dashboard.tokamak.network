<template>
  <div>
    <div class="title">Re-stake</div>
     <div class="image-container image" :style="{marginTop: '90px', marginBottom: '40px', backgroundColor: '#ffffff'}">
      <img class="screenshot" :style="{width: '50%'}" src="@/assets/images/support/restake_01.png">
      <img class="screenshot rightImage" :style="{width: '50%'}" src="@/assets/images/support/restake_02.png">
    </div>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Press the ‘Re-stake’ button. Popup will appear</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Writing down the quantity of TON to Re-stake
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Click ‘Re-stake’ button
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Check the connected metamask
      </li>
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
