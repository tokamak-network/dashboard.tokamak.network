<template>
  <div class="winner-list-container">
    <container-header :title="'Winner'" />
    <div class="divider" />
    <winner-table />
  </div>
</template>

<script>
import ContainerHeader from '@/containers/ContainerHeader.vue';
import WinnerTable from '@/components/table/WinnerTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'winner-table': WinnerTable,
  },
};
</script>

<style scoped>
.winner-list-container {
  height: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}

.divider {
  border-bottom: solid 0.5px #dce2e5;
}
</style>
