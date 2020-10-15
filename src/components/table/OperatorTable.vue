<template>
  <table class="operator-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('name')">{{ withArrow('name', 'Operator Name') }}</th>
        <th class="pointer text-center" @click="orderBy('layer2')">{{ withArrow('layer2', 'Operator Contract') }}</th>
        <th class="pointer text-center" @click="orderBy('commissionRate')">{{ withArrow('commissionRate', 'Commission Rate') }}</th>
        <th class="pointer text-center" @click="orderBy('userStaked')">{{ withArrow('userStaked', 'My Staked') }}</th>
        <th class="pointer text-center" @click="orderBy('totalStaked')">{{ withArrow('totalStaked', 'Total Staked') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(operator, index) in orderedOperators" :key="operator.layer2">
        <td class="text-center">{{ index }}</td>
        <td class="clickable text-center name" @click="viewDetailedOperator(operator)"><span class="pointer name">{{ operator.name }}</span></td>
        <td class="text-center">
          <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            :href="toExplorer('address', operator.layer2)"
          >
            {{ operator.layer2 | hexSlicer }}
          </a>
        </td>
        <td class="text-center">{{ operator.isCommissionRateNegative ? '-' : '' }}{{ operator.commissionRate | rateOf }} </td>
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
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operators, (operator) => operator.name, [this.order]);
      case 'commissionRate':
        return orderBy(this.operators, (operator) => operator.commissionRate.toNumber(), [this.order]);
      case 'layer2':
        return orderBy(this.operators, (operator) => operator.layer2, [this.order]);
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
  mounted () {
    const addressLinks = this.$el.getElementsByClassName('link');

    Object.values(addressLinks).map(link => {
      const address = this.$options.filters.addressExtractor(link.href);
      link.addEventListener('copy', e => {
        e.clipboardData.setData('text/plain', address);
        e.preventDefault();
      });
    });
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
      const layer2 = operator.layer2;
      this.$router.push({
        path: `/operators/${layer2.toLowerCase()}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
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
  background: #ffffff;
}

.operator-table td, .operator-table th {
  border-top: solid 1px #dce2e5;
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
  padding: 6px;
  background-color: #f6f8f9;
  font-family: "Noto Sans",sans-serif;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7e8d93;
}

td {
  padding: 12px;
  font-family: "Noto Sans",sans-serif;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #161819;
}

.name {
  width: 200px;
  word-break: break-all;
}

.link {
  color: black;
}
</style>
