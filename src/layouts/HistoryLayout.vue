<template>
  <div class="history-layout">
    <container-header :title="'History'" />
    <history-table />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.vue';
import HistoryTable from '../components/table/HistoryTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'history-table': HistoryTable,
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
