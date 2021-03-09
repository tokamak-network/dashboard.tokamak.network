<template>
  <div>
    <table class="history-table">
      <thead>
        <tr>
          <th class="text-center">Transaction Hash</th>
          <th class="text-center">Type</th>
          <th class="text-center">Amount</th>
          <th class="text-center">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction) in filteredTransactions" :key="transaction.transactionHash">
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
          <td class="text-center">{{ transaction.type }}</td>
          <td class="text-center">{{ currencyAmountFromNumberString(transaction.type, transaction.amount) }}</td>
          <td class="text-center">{{ transaction.timestamp | formattedTimestamp }}</td>
        </tr>
      </tbody>
    </table>
    <table-paginate
      :pages="pages"
      @update-page="updateTableByPage"
    />
  </div>
</template>

<script>
import web3EthABI from 'web3-eth-abi';
import { orderBy } from 'lodash';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
import TablePaginate from '@/components/TablePaginate.vue';

import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    'table-paginate': TablePaginate,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      from: 'blockNumber',
      order: 'desc',
      base: 5,
      pages: 0,
      updatedTransactions: [],
      orderedRounds: [],
      filteredTransactions: [],
    };
  },
  computed: {
    ...mapState([
      'web3',
    ]),
    ...mapGetters(['transactionsByOperator']),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    transactions (){
      return this.transactionsByOperator(this.layer2);
    },
    formattedTimestamp () {
      return timestamp => this.$options.filters.formattedTimestamp(timestamp);
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
      case 'layer2':
        return orderBy(this.transactions, (transaction) => transaction.target, [this.order]);
      case 'date':
        return orderBy(this.transactions, (transaction) => transaction.blockNumber, [this.order]);
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
  mounted () {
    const addressLinks = this.$el.getElementsByClassName('link');

    Object.values(addressLinks).map(link => {
      const address = this.$options.filters.addressExtractor(link.href);
      link.addEventListener('copy', e => {
        e.clipboardData.setData('text/plain', address);
        e.preventDefault();
      });
    });
    this.pages = parseInt(this.transactions.length / this.base) + 1;
    if (this.pages > 1 && this.transactions.length % this.base === 0) {
      this.pages = this.pages - 1;

    }
    this.filteredTransactions = this.orderedTransaction.slice(0, this.base);
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
    updateTableByPage (page) {
      this.filteredTransactions = this.orderedTransaction.slice((page - 1) * this.base, page * this.base);
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

.link {
  color: black;
}
</style>
