<template>
  <div>
    <search-bar />
    <standard-table style="margin-top: 8px;" />
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable.vue';
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    'standard-table': StandardTable,
    'search-bar': SearchBar,
  },
};
</script>

<style>
</style>
