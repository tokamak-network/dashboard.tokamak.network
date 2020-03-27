<template>
  <div class="stake-info-layout">
    <stake-info-container style="flex: 1;" />
    <staked-operator-table style="flex: 1" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StakeInfoContainer from '@/containers/StakeInfoContainer.vue';
import StakedOperatorTable from '../components/table/StakedOperatorTable.vue';

export default {
  components: {
    'stake-info-container': StakeInfoContainer,
    'staked-operator-table': StakedOperatorTable,
  },
  data () {
    return {
      columns: [],
      searching: false,
      operatorsBySearching: [],
    };
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
  },
  created () {
    this.columns = [
      {
        name: 'OPERATOR',
        key: 'name',
      },
      {
        name: 'MY STAKE',
        key: 'userStaked',
      },
    ];
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
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
.stake-info-layout {
  display: flex;
  flex-direction: row;
}

.divider {
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 1px;
  background: #b4b4b4;
}

.table-container {
  flex: 1;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-left: 4px;
}
</style>
