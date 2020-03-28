<template>
  <div class="dashboard-history">
    <dashboard-header :title="'History'" :path="'history'" />
    <dashboard-history-table />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.vue';
import DashboardHistoryTable from '@/components/table/DashboardHistoryTable.vue';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'dashboard-history-table': DashboardHistoryTable,
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
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-top: 8px;
}
</style>
