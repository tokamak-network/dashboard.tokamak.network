<template>
  <div>
    <div class="title">PowerTON</div>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Round:</strong> Current round number.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Round Reward:</strong> Total Round Reward(it is accumulated from round start).</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> <strong>24 Hour:</strong> Changes in round reward compared to yesterday.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"> <strong>Round Start:</strong> Round start time.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Round End:</strong> Round end time.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Rank:</strong> User Power Ranking.</li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px"><strong>Winner:</strong> Winner and reward of the previous round.</li>
    </ol>
    <div class="image-container">
      <img class="power-screenshot" src="@/assets/images/powerton_screenshot.jpg">
    </div>
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

.power-screenshot {
    width: 100%;
    height: 100%;
    margin-top: 70px;
  margin-bottom: 40px;
 box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
</style>
