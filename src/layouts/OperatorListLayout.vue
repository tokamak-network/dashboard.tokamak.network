<template>
  <div>
    <search-bar
      @valueChanged="searchOperatorByName"
    />
    <div class="operator-list-layout">
      <standard-table
        :columns="columns"
        :clickable="true"
        :datas="searching ? operatorListBySearching : operatorList"
        @tableDataClicked="clickOperatorInfo"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';
import SearchBar from '@/components/SearchBar.vue';

const columns = [
  {
    name: 'ADDRESS',
    key: 'address',
  },
  {
    name: 'NAME',
    key: 'name',
  },
  {
    name: 'COMMIT TIMESTAMP',
    key: 'timestamp',
  },
  {
    name: 'COMMISSION RATE',
    key: 'commission',
  },
];

export default {
  components: {
    'standard-table': StandardTable,
    'search-bar': SearchBar,
  },
  data () {
    return {
      columns: [],
      searching: false,
      operatorListBySearching: [],
    };
  },
  computed: mapState([
    'operatorList',
  ]),
  async beforeCreate () {
    await this.$store.dispatch('checkAndGetData', 'operator');
    await new Promise(r => setTimeout(r, 2500));
  },
  beforeMount () {
    this.columns = columns;
  },
  methods: {
    clickOperatorInfo (data) {
      this.$router.push('/operators/onther');
    },
    searchOperatorByName (name) {
      if (name === '') {
        this.searching = false;
      } else {
        this.searching = true;
        this.operatorListBySearching = this.operatorList.filter(operator => operator.name.includes(name));
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
}
</style>
