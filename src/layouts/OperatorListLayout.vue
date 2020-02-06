<template>
  <div>
    <search-bar
      @valueChanged="searchOperatorByName"
    />

    <div class="operator-list-layout table-container">
      <standard-table
        :type="'operator'"
        :columns="[
          {
            name: 'OPERATOR',
            key: 'name',
          },
          {
            name: 'ADDRESS',
            key: 'address',
          },
          {
            name: 'COMMIT TIMESTAMP',
            key: 'recentCommitTimestamp',
          },
          {
            name: 'TOTAL STAKE',
            key: 'totalStake',
          },
        ]"
        :datas="searching ? operatorsBySearching : operators"
        :rounded="true"
        :clickable="true"
        @tableDataClicked="viewOperator"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    'standard-table': StandardTable,
    'search-bar': SearchBar,
  },
  data () {
    return {
      columns: [],
      searching: false,
      operatorsBySearching: [],
    };
  },
  computed: mapState([
    'operators',
  ]),
  async beforeCreate () {
    // await this.$store.dispatch('checkAndGetData', 'operator');
    await new Promise(r => setTimeout(r, 2500));
  },
  methods: {
    viewOperator (operator) {
      const address = operator.address;
      this.$router.push(`/operators/${address.toLowerCase()}`);
    },
    searchOperatorByName (name) {
      if (name === '') {
        this.searching = false;
      } else {
        this.searching = true;
        // TODO: modify logic
        this.operatorsBySearching = this.operators.filter(operator => operator.name.includes(name));
      }
    },
  },
};
</script>

<style scoped>
.operator-list-layout {
  margin-top: 8px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
