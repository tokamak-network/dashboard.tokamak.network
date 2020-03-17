<template>
  <div class="column text-viewer">
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
      type: String,
    },
  },
};
</script>

<style scoped>
.text-viewer {
  margin-top: 4px;
  margin-bottom: 4px;
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
  margin-left: 16px;
}

.content {
  float: right;
  margin-right: 16px;
}
</style>
