
import { mapState } from 'vuex';
import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.js';
import DashboardHistoryTable from '@/components/table/DashboardHistoryTable.js';

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
