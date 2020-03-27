<template>
  <div class="text-viewer">
    <hr class="divider" :style="[withDivider ? {} : {'visibility': 'hidden'}]">
    <div class="row">
      <span class="title">{{ title }}</span>
      <div class="content-container"><span class="content">{{ content }}</span></div>
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
  width: 100%;
  display: flex;
  flex-direction: row;
}

.content-container {
  flex: 1;
}

.title {
  padding-left: 16px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.content {
  padding-right: 16px;
  float: right;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
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
