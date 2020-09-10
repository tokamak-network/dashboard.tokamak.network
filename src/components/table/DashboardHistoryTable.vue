<template>
  <table class="dashboard-history-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center pointer" @click="orderBy('transactionHash')">{{ withArrow('transactionHash', 'Transaction Hash') }}</th>
        <th class="text-center pointer" @click="orderBy('layer2')">{{ withArrow('layer2', 'Layer2') }}</th>
        <th class="text-center pointer" @click="orderBy('type')">{{ withArrow('type', 'Type') }}</th>
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
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
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
      case 'state':
        return orderBy(this.transactions, (transaction) => transaction.receipt.state, [this.order]);
      case 'status':
        return orderBy(this.transactions, (transaction) => transaction.receipt.status, [this.order]);
      case 'layer2':
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
  },
};
</script>

<style scoped>
.dashboard-history-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.dashboard-history-table td, .dashboard-history-table th {
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

.dashboard-history-table th {
  text-align: left;
}

.dashboard-history-table td {
  text-align: left;
}

.dashboard-history-table .text-center {
  text-align: center;
}

.dashboard-history-table .text-right {
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

.link {
  color: black;
}
</style>
