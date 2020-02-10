<template>
  <div class="history-layout table-container">
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
          name: 'BLOCK',
          key: 'blockNumber',
        },
        {
          name: 'STATUS',
          key: 'status',
        },
      ]"
      :datas="userHistory"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
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
