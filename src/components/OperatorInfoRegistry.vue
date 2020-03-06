<template>
  <div class="column">
    <avatar fullname="O P R" :color="'red'" :image="''" :size="50" />
    <div class="row">
      <span class="title">NAME</span>
      <div class="content-container"><span class="content">{{ registry.name }}</span></div>
    </div>
    <div class="row">
      <span class="title">WEBSITE</span>
      <div class="content-container"><span class="content">{{ registry.website }}</span></div>
    </div>
    <div class="row">
      <span class="title">DESCRIPTION</span>
      <div class="content-container"><span class="content">{{ registry.description }}</span></div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar-component';

export default {
  components: {
    'avatar': Avatar,
  },
  props: {
    registry: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.title {
  width: 100px;
}

.content-container {
  flex: 1;
}

.content {
  float: right;
  word-break: break-all;
}
</style>
