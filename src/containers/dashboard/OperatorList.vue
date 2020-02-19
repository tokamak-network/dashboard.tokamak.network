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
        :type="'operator'"
        :columns="[
          {
            name: 'OPERATOR',
            key: 'name',
          },
          {
            name: 'TOTAL STAKE',
            key: 'totalStake',
          },
        ]"
        :datas="operators"
        :clickable="true"
        :rounded="true"
        @tableDataClicked="viewOperator"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  components: {
    'standard-table': StandardTable,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
  },
  methods: {
    viewOperator (operator) {
      const address = operator.address;
      this.$router.push(`/operators/${address.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
</style>
