<template>
  <div>
    <search-bar
      @changedValue="searchOperatorByName"
    />
    <div class="operator-list-layout">
      <standard-table
        :columns="['ADDRESS', 'NAME', 'COMMIT TIMESTAMP', 'COMMISSION RATE']"
        :clickable="true"
        :datas="searching ? operatorListBySearching : operatorList"
        @clickedTableData="clickOperatorInfo"
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
      searching: false,
      operatorListBySearching: [],
    };
  },
  computed: mapState([
    'operatorList',
  ]),
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

<style>
.operator-list-layout {
  margin-top: 8px;
  margin-bottom: -19.5px;
  border-left: solid 0.7px #ced6d9;
  border-right: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
</style>
