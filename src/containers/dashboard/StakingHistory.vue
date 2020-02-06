<template>
  <div class="table-container">
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <div v-else>
      <standard-table
        :rounded="true"
        :columns="columns"
        :datas="operatorList"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js';
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const columns = [
  {
    name: 'ADDRESS',
    key: 'address',
  },
  {
    name: 'NAME',
    key: 'name',
  },
];

export default {
  components: {
    'standard-table': StandardTable,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: true,
    };
  },
  computed: mapState([
    'operatorList',
  ]),
  async beforeCreate () {
    const res = await api.sample();
    await new Promise(r => setTimeout(r, 2500));
    this.isLoading = false;
  },
  beforeMount () {
    this.columns = columns;
  },
};
</script>

<style scoped>
</style>
