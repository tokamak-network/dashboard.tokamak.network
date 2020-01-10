<template>
  <div>
    <search-bar />
    <standard-table
      style="margin-top: 8px;"
      :columns="['ADDRESS', 'NAME', 'COMMIT TIMESTAMP', 'COMMISSION RATE']"
      :datas="datas"
    />
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
  data () {
    return {
      datas: [
        {
          '1': 1000,
          '2': 20000,
          '3': 3000,
          '4': 4000,
        },
      ],
    };
  },
};
</script>

<style>
</style>
