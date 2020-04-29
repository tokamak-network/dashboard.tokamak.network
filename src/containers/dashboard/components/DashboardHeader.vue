<template>
  <div class="dashboard-header">
    <div class="title"><span>{{ title }}</span></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  flex-direction: row;
  padding-top: 12px;
  padding-bottom: 12px;
}

.title {
  flex: 1;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  padding-left: 20px;
  color: #124b71;
}
</style>
