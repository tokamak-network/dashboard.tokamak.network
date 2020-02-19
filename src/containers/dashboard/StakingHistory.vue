<template>
  <div class="table-container">
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <div v-else>
      <standard-table
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
import api from '@/api';
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    'standard-table': StandardTable,
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
