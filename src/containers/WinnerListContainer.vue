<template>
  <div class="winner-list-container">
    <base-table :type="'winner'" :columns="columns" :datas="rounds" :rounded="true" />
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    'base-table': BaseTable,
  },
  props: {
    rounds: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      columns: [],
    };
  },
  created () {
    this.columns = [
      {
        name: 'ROUND',
        key: 'round',
      },
      {
        name: 'WINNER ACCOUNT',
        key: 'winner',
      },
      {
        name: 'REWARD',
        key: 'reward',
      },
    ];
  },
};
</script>

<style scoped>
.winner-list-container {
  margin-top: 8px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
