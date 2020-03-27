<template>
  <div>
    <div class="staked-operator-list-layout">
      <container-header :title="'Staked Operator'" />
      <staked-operator-table />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.vue';
import StakedOperatorTable from '../components/table/StakedOperatorTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'staked-operator-table': StakedOperatorTable,
  },
};
</script>

<style scoped>
.staked-operator-list-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
