<template>
  <div class="history-layout table-container">
    <standard-table
      :rounded="true"
      :datas="datas"
    />
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
  },
  data () {
    return {
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
};
</script>

<style scoped>
.history-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}
</style>
