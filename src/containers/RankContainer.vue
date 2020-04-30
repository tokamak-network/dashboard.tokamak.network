<template>
  <div class="rank-container">
    <container-header :title="'Rank'" />
    <rank-table />
  </div>
</template>

<script>
import ContainerHeader from '@/containers/ContainerHeader.vue';
import RankTable from '@/components/table/RankTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'rank-table': RankTable,
  },
};
</script>

<style scoped>
.rank-container {
  height: 100%;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
