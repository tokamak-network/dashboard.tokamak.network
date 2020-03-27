<template>
  <div class="rank-container">
    <rank-table />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import RankTable from '@/components/table/RankTable.vue';

export default {
  components: {
    'rank-table': RankTable,
  },
};
</script>

<style scoped>
.rank-container {
  margin-top: 8px;
}
</style>
