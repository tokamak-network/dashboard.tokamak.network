<template>
  <div class="history-layout table-container">
    <standard-table
      :rounded="true"
      :columns="columns"
      :datas="operatorList"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';

const columns = [
  {
    name: 'ADDRESS',
    key: 'address',
  },
  {
    name: 'NAME',
    key: 'name',
  },
  {
    name: 'COMMIT TIMESTAMP',
    key: 'timestamp',
  },
  {
    name: 'COMMISSION RATE',
    key: 'commission',
  },
];

export default {
  components: {
    'standard-table': StandardTable,
  },
  data () {
    return {
      columns: [],
      datas: [
        {
          '1': 1000,
          '2': 20000,
          '3': 3000,
          '4': 4000,
        },
      ],
    };
  },
  computed: mapState([
    'operatorList',
  ]),
  beforeMount () {
    this.columns = columns;
  },
};
</script>

<style scoped>
.history-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
