<template>
  <div class="winner-list-container">
    <container-header :title="'Winner'" />
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
</style>
