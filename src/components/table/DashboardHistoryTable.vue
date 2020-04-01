<template>
  <table class="dashboard-history-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center pointer" @click="orderBy('transactionHash')">{{ withArrow('transactionHash', 'Transaction Hash') }}</th>
        <th class="text-center pointer" @click="orderBy('rootchain')">{{ withArrow('rootchain', 'RootChain') }}</th>
        <th class="text-center pointer" @click="orderBy('state')">{{ withArrow('state', 'State') }}</th>
        <th class="text-center pointer" @click="orderBy('type')">{{ withArrow('type', 'Type') }}</th>
        <th class="text-center pointer" @click="orderBy('amount')">{{ withArrow('amount', 'Amount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(transaction, index) in orderedTransaction" :key="transaction.transactionHash">
        <td class="text-center">{{ index }}</td>
        <td class="text-center">{{ transaction.transactionHash | hexSlicer }}</td>
        <td class="text-center">{{ transaction.target | hexSlicer }}</td>
        <td class="text-center">{{ transaction.receipt ? 'mined' : 'pending' }}</td>
        <td class="text-center">{{ transactionType(transaction) }}</td>
        <!-- <td class="text-center">{{ currencyAmount(amount(transaction)) }}</td> -->
      </tr>
    </tbody>
  </table>
</template>

<script>
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
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    orderedTransaction () {
      switch (this.from) {
      case 'transactionHash':
        return orderBy(this.transactions, (transaction) => transaction.transactionHash, [this.order]);
      case 'type':
        return orderBy(this.transactions, (transaction) => this.transactionType(transaction), [this.order]);
      case 'amount':
        return orderBy(this.transactions, (transaction) => this.amount(transaction).toNumber(), [this.order]);
      case 'blockNumber':
        return orderBy(this.transactions, (transaction) => transaction.receipt.blockNumber, [this.order]);
      case 'state':
        return orderBy(this.transactions, (transaction) => transaction.receipt.state, [this.order]);
      case 'status':
        return orderBy(this.transactions, (transaction) => transaction.receipt.status, [this.order]);
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
    transactionType () {
      return transaction => {
        const Deposited = this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256)');
        const WithdrawalRequested = this.web3.eth.abi.encodeEventSignature('WithdrawalRequested(address,address,uint256)');
        const WithdrawalProcessed = this.web3.eth.abi.encodeEventSignature('WithdrawalProcessed(address,address,uint256)');

        let type = '-';
        const logs = transaction.receipt.logs;
        if (logs) {
          loop1:
          for (const log of logs) {
            for (const topic of log.topics) {
              switch (topic) {
              case Deposited:
                type ='Delegated';
                break loop1;

              case WithdrawalRequested:
                type = 'Undelegate Requested';
                break loop1;

              case WithdrawalProcessed:
                type = 'Undelegate Processed';
                break loop1;
              }
            }
          }
        }
        return type;
      };
    },
    amount () {
      return transaction => {
        const Deposited = this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256)');
        const WithdrawalRequested = this.web3.eth.abi.encodeEventSignature('WithdrawalRequested(address,address,uint256)');
        const WithdrawalProcessed = this.web3.eth.abi.encodeEventSignature('WithdrawalProcessed(address,address,uint256)');

        let amount = _WTON.ray('0');
        const logs = transaction.receipt.logs;
        if (logs) {
          for (const log of logs) {
            for (const topic of log.topics) {
              switch (topic) {
              case Deposited:
                amount = amount.add(_WTON.ray((this.web3.eth.abi.decodeParameters(['address', 'uint256'], log.data))[1]));
                break;

              case WithdrawalRequested:
                amount = amount.add(_WTON.ray((this.web3.eth.abi.decodeParameters(['address', 'uint256'], log.data))[1]));
                break;

              case WithdrawalProcessed:
                amount = amount.add(_WTON.ray((this.web3.eth.abi.decodeParameters(['address', 'uint256'], log.data))[1]));
                break;
              }
            }
          }
        }
        return amount;
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
</style>
