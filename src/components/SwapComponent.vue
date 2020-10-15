<template>
  <div class="swap-container">
    <div class="swap-title">{{ title }}</div>
    <div class="swap-value">{{ balance }}</div>
    <div class="divider" />
    <div class="rewards-container">
      <div>{{ rewards }}</div>
      <div>{{ value }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props:['title', 'balance', 'rewards', 'value'],
};
</script>

<style scoped>
.swap-container {
    padding-top: 16px;
  width: 290px;
  margin-bottom: 50px;
  background-color:#e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
  height: 130px;
}
.swap-title {
  padding-left: 16px;
  padding-bottom: 6px;
  color: #8c8c8c;
  font-size: 16px;
}
.swap-value {
  padding-left: 16px;
  font-size: 36px;
  font-weight: 700;
  color: #555555;
  padding-bottom: 5px;
}
.divider {
  width: 100%;
  height: 1px;
  background: #ccd1d3;
}
.rewards-container {
    padding: 10px 16px;
    display: flex;
    flex-direction: row;
    color: #8c8c8c;
  font-size: 14px;
  justify-content: space-between;
}
</style>
