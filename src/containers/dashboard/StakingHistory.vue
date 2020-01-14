<template>
  <div>
    <standard-table
      :columns="['TYPE', 'AMOUNT', 'TRANSACTION', 'TIMESTAMP']"
    />
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
  },
};
</script>

<style>
</style>
