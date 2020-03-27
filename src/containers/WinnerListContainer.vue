<template>
  <div class="winner-list-container">
    <winner-table />
  </div>
</template>

<script>
import WinnerTable from '@/components/table/WinnerTable.vue';

export default {
  components: {
    'winner-table': WinnerTable,
  },
};
</script>

<style scoped>
.winner-list-container {
  margin-top: 8px;
}
</style>
