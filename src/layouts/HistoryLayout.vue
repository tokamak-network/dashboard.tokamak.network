<template>
  <div class="history-layout">
    <container-header :title="'History'" />
    <transcation-table />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.vue';
import TransactionTable from '../components/table/TransactionTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'transcation-table': TransactionTable,
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
