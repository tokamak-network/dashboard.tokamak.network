<template>
  <div class="dashboard-history">
    <dashboard-header :title="'HISTORY'" />
    <base-table
      :type="'history'"
      :rounded="true"
      :columns="columns"
      :datas="userHistory"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.vue';
import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'base-table': BaseTable,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: mapState([
    'userHistory',
  ]),
  created () {
    this.columns = [
      {
        name: 'REQUEST',
        key: 'request',
      },
      {
        name: 'TRANSACTION HASH',
        key: 'transactionHash',
      },
      {
        name: 'AMOUNT',
        key: 'amount',
      },
    ];
  },
};
</script>

<style scoped>
.dashboard-history {
  flex: 6;
  min-height: 314px;
  max-height: 314px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-top: 8px;
}
</style>
