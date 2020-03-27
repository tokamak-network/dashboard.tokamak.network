<template>
  <div class="operator-container">
    <h4>Operator</h4>
    <operator-table />
  </div>
</template>

<script>
import OperatorTable from '@/components/table/OperatorTable.vue';

export default {
  components: {
    'operator-table': OperatorTable,
  },
};
</script>

<style scoped>
</style>
