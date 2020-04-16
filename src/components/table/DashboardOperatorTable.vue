<template>
  <table class="dashboard-operator-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('name')">{{ withArrow('name', 'Operator Name') }}</th>
        <th class="pointer text-center" @click="orderBy('userStaked')">{{ withArrow('userStaked', 'Staked') }}</th>
        <th class="pointer text-center" @click="orderBy('totalStaked')">{{ withArrow('totalStaked', 'Total Staked') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(operator, index) in orderedOperators" :key="operator.rootchain">
        <td class="text-center">{{ index }}</td>
        <td class="clickable text-center name" @click="viewDetailedOperator(operator)"><span class="pointer name">{{ operator.name }}</span></td>
        <td class="text-center">{{ operator.userStaked | currencyAmount }} </td>
        <td class="text-center">{{ operator.totalStaked | currencyAmount }} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { orderBy } from 'lodash';
import { mapState } from 'vuex';

export default {
  data () {
    return {
      from: 'name',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operators, (operator) => operator.name, [this.order]);
      case 'userStaked':
        return orderBy(this.operators, (operator) => operator.userStaked.toNumber(), [this.order]);
      case 'totalStaked':
        return orderBy(this.operators, (operator) => operator.totalStaked.toNumber(), [this.order]);

      default:
        return [];
      }
    },
    withArrow () {
      return (from, label) => {
        if (this.from === from) {
          return this.order === 'desc' ? `${label} ↑` : `${label} ↓`;
        }
        return label;
      };
    },
  },
  methods: {
    orderBy (from) {
      if (this.from === from) {
        this.order = this.changedOrder();
      } else {
        this.from = from;
        this.order = 'desc';
      }
    },
    changedOrder () {
      return this.order === 'desc' ? 'asc' : 'desc';
    },
    viewDetailedOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push({
        path: `/operators/${rootchain.toLowerCase()}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
    },
  },
};
</script>

<style scoped>
.dashboard-operator-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.dashboard-operator-table td, .dashboard-operator-table th {
  border-top: solid 0.5px #dce2e5;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

tbody tr:hover {
  background-color: #f8f8f8;
}

.pointer {
  cursor: pointer;
}

tbody .clickable {
  font-weight: bolder;
  text-decoration: underline;
}

.dashboard-operator-table th {
  text-align: left;
}

.dashboard-operator-table td {
  text-align: left;
}

.dashboard-operator-table .text-center {
  text-align: center;
}

.dashboard-operator-table .text-right {
  text-align: right;
}

th {
  padding: 6px;
  background-color: #f6f8f9;
  font-family: Roboto;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7e8d93;
}

td {
  padding: 12px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #161819;
}

.name {
  width: 160px;
  word-break: break-all;
}
</style>
