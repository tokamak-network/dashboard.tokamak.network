<template>
  <div>
    <div class="operator-list-layout">
      <container-header :title="'Operators'" />
      <operator-table />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.vue';
import OperatorTable from '@/components/table/OperatorTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'operator-table': OperatorTable,
  },
};
</script>

<style scoped>
.operator-list-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
