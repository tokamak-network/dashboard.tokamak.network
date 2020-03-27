<template>
  <div class="winner-container">
    <h4>Winner</h4>
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
</style>
