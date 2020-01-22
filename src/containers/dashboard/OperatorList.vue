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
        :columns="columns"
        :clickable="true"
        :rounded="true"
        :datas="operatorList"
        @tableDataClicked="clickOperatorInfo"
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
    this.isLoading = true;
    await this.$store.dispatch('checkAndGetData', 'operator');
    // await new Promise(r => setTimeout(r, 2500));
    this.isLoading = false;
  },
  beforeMount () {
    this.columns = columns;
  },
  methods: {
    clickOperatorInfo (data) {
      this.$router.push('/operators/onther');
    },
  },
};
</script>

<style scoped>
</style>
