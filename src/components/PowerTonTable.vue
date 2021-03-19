<template>
  <div class="power-table">
    <rank-table />
    <power-winner-table />
  </div>
</template>

<script>
import PowerWinnertable from '@/components/table/PowerWinnerTable';
import RankTable from '@/components/table/RankTable';

export default {
  components: {
    'power-winner-table': PowerWinnertable,
    'rank-table': RankTable,
  },
};

</script>

<style scoped>
.power-table {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
