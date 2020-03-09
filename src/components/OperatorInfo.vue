<template>
  <div class="column">
    <hr>
    <div class="row">
      <span class="title">{{ title }}</span>
      <div class="content-container"><span class="content">{{ filteredContent }}</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {},
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
.column{
  display: flex;
  flex-direction: column;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.title {
  width: 120px;
  font-size: 12px;
  font-weight: 300;
  text-align: left;
  color: #676767;
  margin-left: 16px
}

.content-container {
  flex: 1;
  margin-right: 16px;
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

hr {
  background-color: #586064;
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
