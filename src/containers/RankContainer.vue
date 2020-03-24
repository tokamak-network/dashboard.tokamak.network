<template>
  <div class="rank-container">
    <base-table :type="'rank'" :columns="columns" :datas="sortedAccountsByPower" :rounded="true" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    'base-table': BaseTable,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: {
    ...mapGetters([
      'sortedAccountsByPower',
    ]),
  },
  created () {
    this.columns = [
      {
        name: 'RANK',
        key: 'rank',
      },
      {
        name: 'ACCOUNT',
        key: 'address',
      },
      {
        name: 'POWER',
        key: 'power',
      },
    ];
  },
};
</script>

<style scoped>
.rank-container {
  margin-top: 8px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
