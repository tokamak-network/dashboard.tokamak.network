<template>
  <div>
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <standard-table
      v-else
      :columns="['ADDRESS', 'NAME']"
      :clickable="true"
      @clickedTableData="clickOperatorInfo"
    />
  </div>
</template>

<script>
import api from '@/api/index.js';

import StandardTable from '@/components/StandardTable.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

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
  async beforeCreate () {
    const res = await api.sample();
    await new Promise(r => setTimeout(r, 2500));
    this.isLoading = false;
  },
  methods: {
    clickOperatorInfo (data) {
      this.$router.push('/operators/onther');
    },
  },
};
</script>

<style>
</style>
