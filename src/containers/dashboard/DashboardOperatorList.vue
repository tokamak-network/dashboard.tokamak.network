<template>
  <div class="operator-list">
    <dashboard-header :title="'OPERATOR LIST'" />
    <base-table
      :type="'operator'"
      :columns="columns"
      :datas="operators"
      :clickable="true"
      :rounded="true"
      @tableDataClicked="viewOperator"
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
        key: 'totalStake',
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
</script>

<style scoped>
.operator-list {
  flex: 6;
  min-height: 314px;
  max-height: 314px;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}
</style>
