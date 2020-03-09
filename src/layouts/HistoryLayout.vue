<template>
  <div class="history-layout table-container">
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
</template>

<script>
import { mapState } from 'vuex';

import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    'base-table': BaseTable,
  },
  computed: mapState([
    'userHistory',
  ]),
};
</script>

<style scoped>
.history-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
