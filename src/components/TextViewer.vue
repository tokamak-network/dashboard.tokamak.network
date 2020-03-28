<template>
  <div class="text-viewer">
    <hr class="divider" :style="[withDivider ? {} : {'visibility': 'hidden'}]">
    <div class="row">
      <div class="title">{{ title }}</div>
      <div class="content" :style="[title === 'Description' ? { 'width': '168px' } : {}]">{{ content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    content: {
    },
    withDivider: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.text-viewer {
  margin-bottom: 6px;
}

.row {
  display: flex;
  flex-direction: row;
}

.title {
  padding-left: 16px;
  margin-right: 24px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.content {
  display: inline-block;
  flex: 1;
  text-align: right;
  padding-right: 16px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
  word-break: break-all;
}

.divider {
  height: 0;
  border: solid 0.5px #dce2e5;
  margin: 0px;
  padding: 0px;
  margin-bottom: 8px;
}

.hidden {
  visibility: hidden;
}
</style>
