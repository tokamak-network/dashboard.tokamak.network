<template>
  <div class="viewer-power-container">
    <text-viewer :title="'POWER'" :content="power" :with-divider="true" />
    <text-viewer :title="'RANK'" :content="rank" :with-divider="false" />
  </div>
</template>

<script>
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
  props: {
    power: {
    },
    rank: {
    },
  },
};
</script>

<style scoped>
.viewer-power-container {
  height: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-left: 4px;
}

.column {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
