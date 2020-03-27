<template>
  <table class="operator-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('name')">{{ withArrow('name', 'Operator Name') }}</th>
        <th class="pointer text-right" @click="orderBy('operator')">{{ withArrow('operator', 'Operator') }}</th>
        <th class="pointer text-right" @click="orderBy('rootchain')">{{ withArrow('rootchain', 'RootChain') }}</th>
        <th class="pointer text-right" @click="orderBy('userStaked')">{{ withArrow('userStaked', 'Staked') }}</th>
        <th class="pointer text-right" @click="orderBy('totalStaked')">{{ withArrow('totalStaked', 'Total Staked') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(operator, index) in orderedOperators" :key="operator.rootchain">
        <td class="text-center">{{ index }}</td>
        <td class="clickable text-center" @click="viewDetailedOperator(operator)"><span class="pointer name">{{ operator.name }}</span></td>
        <td class="text-right">{{ operator.address | hexSlicer }}</td>
        <td class="text-right">{{ operator.rootchain | hexSlicer }}</td>
        <td class="text-right">{{ operator.userStaked | convertedTONFromWTON }} </td>
        <td class="text-right">{{ operator.totalStaked | convertedTONFromWTON }} </td>
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
      case 'operator':
        return orderBy(this.operators, (operator) => operator.address, [this.order]);
      case 'rootchain':
        return orderBy(this.operators, (operator) => operator.rootchain, [this.order]);
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
      this.$router.push(`/operator/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
.operator-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.operator-table td, .operator-table th {
  border-top: 1px solid #555561;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

/* .operator-table tr:nth-child(even){background-color: #f2f2f2;} */

tbody tr:hover {
  background-color: #ececec;
}

.pointer {
  cursor: pointer;
}

tbody .clickable {
  font-weight: bolder;
  text-decoration: underline;
}

.operator-table th {
  text-align: left;
}

.operator-table td {
  text-align: left;
}

.operator-table .text-center {
  text-align: center;
}

.operator-table .text-right {
  text-align: right;
}

th {
  padding: 8px;
}

td {
  padding: 4px;
}

.name {
  word-break: break-all;
}
</style>
