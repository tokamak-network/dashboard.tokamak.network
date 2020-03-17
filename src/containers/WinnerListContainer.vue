<template>
  <div class="winner-list-container">
    <base-table :type="'winner'" :columns="columns" />
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable.vue';

export default {
  components: {
    'base-table': BaseTable,
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
        key: 'winnerAccount',
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
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
