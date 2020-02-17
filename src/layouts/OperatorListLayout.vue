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
        :datas="searching ? operatorsByName : operators"
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
        this.operatorsByName =
          this.operators.filter(operator => operator.name.toLowerCase().includes(name.toLowerCase()));
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
