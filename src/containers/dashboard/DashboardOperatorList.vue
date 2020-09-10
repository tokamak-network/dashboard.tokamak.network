<template>
  <div class="operator-list">
    <dashboard-header :title="'Operators'" :path="'operators'" />
    <dashboard-operator-table />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import DashboardHeader from '@/containers/dashboard/components/DashboardHeader.vue';
import DashboardOperatorTable from '@/components/table/DashboardOperatorTable.vue';

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
      const layer2 = operator.layer2;
      this.$router.push({
        path: `/operators/${layer2.toLowerCase()}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
    },
  },
};
</script>

<style scoped>
.operator-list {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}
</style>
