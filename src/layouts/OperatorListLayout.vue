<template>
  <div>
    <div class="operator-list-layout table-container">
      <standard-table
        :type="'operator'"
        :columns="[
          {
            name: 'OPERATOR',
            key: 'registry.name',
          },
          {
            name: 'ADDRESS',
            key: 'address',
          },
          {
            name: 'COMMIT TIMESTAMP',
            key: 'recentCommitTimestamp',
          },
          {
            name: 'TOTAL STAKE',
            key: 'totalStake',
          },
        ]"
        :datas="operators"
        :rounded="true"
        :clickable="true"
        @tableDataClicked="viewOperator"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: mapState([
    'operators',
  ]),
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
.operator-list-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
