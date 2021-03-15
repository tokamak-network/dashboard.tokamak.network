<template>
  <div class="menu-layout">
    <div class="menu-content">
      <div class="menu-page-header">Select your operator</div>
      <div class="page-text">Select an operator to stake, unstake, or withdraw your tokens.</div>
      <div class="sort-container">
        <div class="candidate-container">
          <Dot :title="'DAO'" />
          <div class="candidate-text">DAO Candidate</div>
          <Dot :title="'Operator'" />
          <div class="candidate-text">Operator</div>
        </div>
        <div class="sort">
          <DropDown :items="['Name', 'Total Staked', 'Recent Commit', 'Participation']"
                    :hint="'Name'"
                    :button-type="'a'"
                    :selector-type="'a'"
                    class="dropdown"
                    @on-selected="select"
          />
        </div>
      </div>

      <div class="balance-container">
        <div v-for="(operator, index) in orderedOperators" :key="index">
          <OperatorComponent :layer2="operator.layer2" />
        </div>
        <!-- <OperatorComponent title="Total Staked TON" balance="0.000" rewards="New rewards per block" value="0.000" /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import OperatorComponent from '@/components/OperatorComponent.vue';
import Dot from '@/components/Dot.vue';
import DropDown from '@/components/DropDown.vue';
import { orderBy } from 'lodash';

export default {
  components: {
    OperatorComponent,
    DropDown,
    Dot,
  },
  data () {
    return {
      selected: false,
      selectedOp:'',
      filteredOperators:[],
      from: 'name',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'operators',
      'selectedOperator',
    ]),
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operators, (operator) => operator.name, [this.order]);
      case 'userStaked':
        return orderBy(this.operators, (operator) => operator.userStaked.toNumber(), [this.order]);
      case 'totalStaked':
        return orderBy(this.operators, (operator) => operator.totalStaked.toNumber(), [this.order]);
      case 'commit':
        return orderBy(this.operators, (operator) => operator.lastFinalizedAt, [this.order]);
      default:
        return this.operators;
      }
    },
  },
  methods: {
    setOperator (operator) {
      this.$store.dispatch('setSelectedOperator', operator);
      this.selected = !this.selected;
      this.selectedOp = operator;
    },
    orderBy (from) {
      if (this.from === from) {
        this.order = this.changedOrder();
      } else {
        this.from = from;
        this.order = 'asc';
      }
    },
    changedOrder () {
      return this.order === 'desc' ? 'asc' : 'desc';
    },
    select (item) {
      if (item === 'Total Staked') {
        this.orderBy('totalStaked');
      } else if (item === 'Name') {
        this.orderBy('name');
      }
      else if (item === 'Recent Commit'){
        this.orderBy('commit');
      }
      else {
        this.orderBy('');
      }
    },
  },
};
</script>
<style scoped>
.menu-layout {
    display: flex;
    justify-content: center;
  background-color: #fafbfc;
  margin-top: 70px;
  width: 100%;
}
.menu-content {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  /* width: 100%; */
}
.menu-page-header {
  font-family: "NanumSquare", sans-serif;
  margin-bottom: 15px;
    font-size: 38px;
    font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
}
.page-text{
   font-family: "Titillium Web", sans-serif;
    font-size: 16px;
  font-weight:normal;
  font-stretch: normal;
  font-style: normal;
  margin-bottom: 60px;
  letter-spacing: 0.4px;
  text-align: center;
  color: #808992;
 }
.balance-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 100%;
    /* flex-flow: row wrap; */
}
.sort-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
}
.candidate-container {
  margin-top: 17px;
  margin-left: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.candidate-dot {
  height: 8px;
  width: 8px;
  border-radius: 4px;
  margin-right:7px;
}
.candidate-text {
  font-family: Roboto;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.82;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
  margin-right: 20px;
}
.sort {
  display: flex;
  justify-content: flex-end;

}
 .dropdown {
    align-items:flex-end;
  }
</style>
