<template>
  <div class="table-container">
    <div
      v-if="isLoading"
      class="loading-container-in-dashboard"
    >
      <loading-spinner />
    </div>
    <standard-table
      :type="'operator'"
      :columns="[
        {
          name: 'OPERATOR',
          key: 'registry.name',
        },
        {
          name: 'MY STAKE',
          key: 'userStake',
        },
      ]"
      :datas="operatorsStaked"
      :rounded="true"
      :clickable="true"
      @tableDataClicked="viewOperator"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    ...mapGetters([
      'operatorsStaked',
    ]),
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
</style>
