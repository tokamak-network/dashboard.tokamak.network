<template>
  <table class="staked-operator-table">
    <caption>Operators</caption>
    <thead>
      <tr>
        <th>#</th>
        <th class="pointer" @click="orderBy('name')">{{ withArrow('name', 'Operator Name') }}</th>
        <th class="text-right pointer" @click="orderBy('userStaked')">{{ withArrow('userStaked', 'User total staked') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(operator, index) in orderedOperators" :key="operator.rootchain">
        <td>{{ index }}</td>
        <td class="clickable" @click="viewDetailedOperator(operator)"><span class="pointer">{{ operator.name }}</span></td>
        <td class="text-right">{{ operator.userStaked | convertedTONFromWTON }} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { orderBy } from 'lodash';

import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      from: 'name',
      order: 'desc',
    };
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operatorsStaked, (operator) => operator.name, [this.order]);

      case 'userStaked':
        return orderBy(this.operatorsStaked, (operator) => operator.userStaked.toFixed('ray'), [this.order]);

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
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
.staked-operator-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

.staked-operator-table td, .staked-operator-table th {
  border-top: 1px solid #555561;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

/* .staked-operator-table tr:nth-child(even){background-color: #f2f2f2;} */

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

.staked-operator-table th {
  text-align: left;
}

.staked-operator-table td {
  text-align: left;
}

.staked-operator-table .text-center {
  text-align: center;
}

.staked-operator-table .text-right {
  text-align: right;
}

caption {
  text-align: left;
}
</style>
