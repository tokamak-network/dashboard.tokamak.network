<template>
  <div class="table-container">
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <div v-else>
      <base-table
        :type="'operator'"
        :columns="[
          {
            name: 'OPERATOR',
            key: 'name',
          },
          {
            name: 'TOTAL STAKE',
            key: 'totalStake',
          },
        ]"
        :datas="operators"
        :clickable="true"
        :rounded="true"
        @tableDataClicked="viewOperator"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import BaseTable from '@/components/BaseTable.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    'base-table': BaseTable,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
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
</style>
