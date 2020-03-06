<template>
  <div class="row">
    <span class="title">{{ title }}</span>
    <div class="content-container"><span class="content">{{ filteredContent }}</span></div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    'is-token': {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      filteredContent: '',
    };
  },
  created () {
    if (this.isToken) this.filteredContent = this.$options.filters.convertToTON(this.content);
    else this.filteredContent = this.content;
  },
};
</script>

<style scoped>
.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.title {
  width: 120px;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #676767;
}

.content-container {
  flex: 1;
}

.content {
  float: right;
  word-break: break-all;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #586064;
}
</style>
