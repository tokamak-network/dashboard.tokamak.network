<template>
  <div class="delegation-state-layout">
    <container-header :title="'Delegation State'" />
    <DelegationStateTable />
  </div>
</template>

<script>
import ContainerHeader from '@/containers/ContainerHeader.vue';
import DelegationStateTable from '@/components/table/DelegationStateTable.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    DelegationStateTable,
  },
};
</script>

<style scoped>
.delegation-state-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
