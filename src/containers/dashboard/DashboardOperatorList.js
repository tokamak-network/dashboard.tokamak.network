
import { mapState } from 'vuex';

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.js';
import DashboardOperatorTable from '@/components/table/DashboardOperatorTable.js';

export default {
  components: {
    'dashboard-header': DashboardHeader,
    'dashboard-operator-table': DashboardOperatorTable,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
  },
  created () {
    this.columns = [
      {
        name: 'OPERATOR',
        key: 'name',
      },
      {
        name: 'TOTAL STAKE',
        key: 'totalStaked',
      },
    ];
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
