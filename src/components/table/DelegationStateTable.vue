<template>
  <table class="delegation-state-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('operator')">{{ withArrow('operator', 'Operator Name') }}</th>
        <!-- <th class="pointer text-center" @click="orderBy('Total Staked')">{{ withArrow('totalStaked', 'Total Staked') }}</th> -->
        <th class="pointer text-center" @click="orderBy('AccStaked')">{{ withArrow('AccStaked', 'Delegated(Accu.)') }}</th>
        <th class="pointer text-center" @click="orderBy('AccUnstaked')">{{ withArrow('AccUnstaked', 'Undelegated(Accu.)') }}</th>
        <th class="pointer text-center" @click="orderBy('dailyStaked')">{{ withArrow('dailyStaked', 'Delegated(Daily)') }}</th>
        <th class="pointer text-center" @click="orderBy('dailyUnstaked')">{{ withArrow('dailyUnstaked', 'Undelegated(Daily)') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(operator, index) in orderedOperators" :key="operator.layer2">
        <td class="text-center">{{ index }}</td>
        <td class="clickable text-center name" @click="viewDetailedOperator(operator)"><span class="pointer name">{{ operator.operator }}</span></td>
        <td class="text-center">{{ operator.accStaked | currencyAmount }} </td>
        <td class="text-center">{{ operator.accUnstaked | currencyAmount }} </td>
        <td class="text-center">{{ operator.dailyStaked | currencyAmount }} </td>
        <td class="text-center">{{ operator.dailyUnstaked | currencyAmount }} </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { orderBy } from 'lodash';
import axios from 'axios';
import { mapState } from 'vuex';
import { createCurrency } from '@makerdao/currency';
const _WTON = createCurrency('WTON');

export default {
  data () {
    return {
      from: 'name',
      order: 'desc',
      operators: [],
    };
  },
  computed: {
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    orderedOperators () {
      switch (this.from) {
      case 'name':
        return orderBy(this.operators, (operator) => operator.operator, [this.order]);
      case 'commissionRate':
        return orderBy(this.operators, (operator) => operator.accStaked.toNumber(), [this.order]);
      case 'layer2':
        return orderBy(this.operators, (operator) => operator.accUnstaked.toNumber(), [this.order]);
      case 'userStaked':
        return orderBy(this.operators, (operator) => operator.dailyStaked.toNumber(), [this.order]);
      case 'totalStaked':
        return orderBy(this.operators, (operator) => operator.dailyUnstaked.toNumber(), [this.order]);

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
  created () {
    this.getStakedInfo();
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
        path: `/stakingdb/${layer2.toLowerCase()}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
    },
    async getStakedInfo () {
      const datas = await axios.get('https://price-api.tokamak.network/staking/accumulative/latest');
      for (const data of datas.data) {
        const convertedData = {
          'operator': data.operator,
          'layer2': data.layer2,
          'accStaked': _WTON(data.accStaked, 'ray'),
          'accUnstaked': _WTON(data.accUnstaked, 'ray'),
          'dailyStaked': _WTON(data.dailyStaked, 'ray'),
          'dailyUnstaked': _WTON(data.dailyUnstaked, 'ray'),
        };
        this.operators.push(convertedData);
      }
    },
  },
};
</script>

<style scoped>
.delegation-state-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.delegation-state-table td, .delegation-state-table th {
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

.delegation-state-table th {
  text-align: left;
}

.delegation-state-table td {
  text-align: left;
}

.delegation-state-table .text-center {
  text-align: center;
}

.delegation-state-table .text-right {
  text-align: right;
}

th {
  padding: 6px;
  background-color: #f6f8f9;
  font-family: Roboto;
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
  font-family: Roboto;
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
