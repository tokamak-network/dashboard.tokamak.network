<template>
  <div class="viewer-power-container">
    <text-viewer :title="'POWER'" :content="'1'" />
    <text-viewer :title="'RANK'" :content="'1'" />
    <text-viewer :title="'WINNING PROBABILITY'" :content="'0.25 %'" />
  </div>
</template>

<script>
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
};
</script>

<style scoped>
.viewer-power-container {
  width: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}

.column {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
