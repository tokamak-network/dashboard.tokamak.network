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
        :type="'history'"
        :rounded="true"
        :columns="[
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
        ]"
        :datas="userHistory"
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
  computed: mapState([
    'userHistory',
  ]),
};
</script>

<style scoped>
</style>
