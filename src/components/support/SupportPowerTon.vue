<template>
  <div>
    <div class="image-container">
      <img class="screenshot" src="@/assets/images/powerton_screenshot.png">
    </div>
    <p class="description">
      1) <strong>Round:</strong> Current round number.
    </p>
    <p class="description">
      2) <strong>Round Reward:</strong> Total Round Reward(it is accumulated from round start).
    </p>
    <p class="description">
      3) <strong>24 Hour:</strong> Changes in round reward compared to yesterday.
    </p>
    <p class="description">
      4) <strong>Round Start:</strong> Round start time.
    </p>
    <p class="description">
      5) <strong>Round End:</strong> Round end time.
    </p>
    <p class="description">
      6) <strong>Rank:</strong> User Power Ranking.
    </p>
    <p class="description">
      7) <strong>Winner:</strong> Winner and reward of the previous round.
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
