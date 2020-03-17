<template>
  <div class="viewer-round-container">
    <text-viewer :title="'ROUND'" :content="'1'" />
    <text-viewer :title="'ROUND start'" :content="'30'" />
    <text-viewer :title="'ROUND finish'" :content="'50'" />
    <text-viewer :title="'PRIZE'" :content="'10 TON'" />
    <text-viewer :title="'current block number'" :content="'30'" />
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
ㄱ
<style scoped>
.viewer-round-container {
  width: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
