<template>
  <div class="rank-container">
    <h4>Rank</h4>
    <rank-table />
  </div>
</template>

<script>
import RankTable from '@/components/table/RankTable.vue';

export default {
  components: {
    'rank-table': RankTable,
  },
};
</script>

<style scoped>
</style>
