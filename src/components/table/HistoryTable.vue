<template>
  <table class="history-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center pointer" @click="orderBy('transactionHash')">{{ withArrow('transactionHash', 'Transaction Hash') }}</th>
        <th class="text-center pointer" @click="orderBy('rootchain')">{{ withArrow('rootchain', 'Operator Contract') }}</th>
        <th class="text-center pointer" @click="orderBy('type')">{{ withArrow('type', 'Type') }}</th>
        <th class="text-center pointer" @click="orderBy('amount')">{{ withArrow('amount', 'Amount') }}</th>
        <th class="text-center pointer" @click="orderBy('blockNumber')">{{ withArrow('blockNumber', 'Block Number') }}</th>
        <th class="text-center pointer" @click="orderBy('status')">{{ withArrow('status', 'Status') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(transaction, index) in orderedTransaction" :key="transaction.transactionHash">
        <td class="text-center">{{ index }}</td>
        <td class="text-center">
          <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            :href="toExplorer('transactionHash', transaction.transactionHash)"
          >
            {{ transaction.transactionHash | hexSlicer }}
          </a>
        </td>
        <td class="text-center">
          <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            :href="toExplorer('address', transaction.target)"
          >
            {{ transaction.target | hexSlicer }}
          </a>
        </td>
        <td class="text-center">{{ transaction.type }}</td>
        <td class="text-center">{{ currencyAmountFromNumberString(transaction.type, transaction.amount) }}</td>
        <td class="text-center">{{ transaction.blockNumber }}</td>
        <td class="text-center">{{ transaction.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import web3EthABI from 'web3-eth-abi';
import { orderBy } from 'lodash';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState } from 'vuex';

export default {
  data () {
    return {
      from: 'blockNumber',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'web3',
      'transactions',
    ]),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    currencyAmountFromNumberString () {
      return (type, amount) => {
        if (type === 'Delegated') {
          return this.$options.filters.currencyAmountFromNumberString('TON', amount);
        } else {
          return this.$options.filters.currencyAmountFromNumberString('WTON', amount);
        }
      };
    },
    orderedTransaction () {
      switch (this.from) {
      case 'transactionHash':
        return orderBy(this.transactions, (transaction) => transaction.transactionHash, [this.order]);
      case 'type':
        return orderBy(this.transactions, (transaction) => transaction.type, [this.order]);
      case 'amount':
        return orderBy(this.transactions, (transaction) => transaction.amount, [this.order]);
      case 'blockNumber':
        return orderBy(this.transactions, (transaction) => transaction.blockNumber, [this.order]);
      case 'status':
        return orderBy(this.transactions, (transaction) => transaction.status, [this.order]);
      case 'rootchain':
        return orderBy(this.transactions, (transaction) => transaction.target, [this.order]);

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
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
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
  },
};
</script>

<style scoped>
.history-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.history-table td, .history-table th {
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

.history-table th {
  text-align: left;
}

.history-table td {
  text-align: left;
}

.history-table .text-center {
  text-align: center;
}

.history-table .text-right {
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

.link {
  color: black;
}
</style>
