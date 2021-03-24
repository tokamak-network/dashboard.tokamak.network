<template>
  <div style="margin-left:-4px">
    <table class="history-table">
      <thead>
        <tr>
          <th class="text-center" style="width:111px">Transaction Hash</th>
          <th class="text-center" style="width:237px">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(transaction) in filteredTransactions" :key="transaction.transactionHash">
          <td class="text-center" style="width:111px; text-align: left; padding-left:2px">
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('transactionHash', transaction.transactionHash)"
            >
              {{ transaction.transactionHash | hexSlicer }}
            </a>
          </td>
          <td class="text-center" style="width:237px">{{ transaction.timestamp | formattedTimestamp }}</td>
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
      // switch (this.from) {
      // case 'transactionHash':
      //   return orderBy(this.transactions, (transaction) => transaction.transactionHash, [this.order]);
      // case 'type':
      //   return orderBy(this.transactions, (transaction) => transaction.type, [this.order]);
      // case 'amount':
      //   return orderBy(this.transactions, (transaction) => transaction.amount, [this.order]);
      // case 'blockNumber':
      //   return orderBy(this.transactions, (transaction) => transaction.blockNumber, [this.order]);
      // case 'layer2':
      //   return orderBy(this.transactions, (transaction) => transaction.target, [this.order]);
      // case 'date':
      //   return orderBy(this.transactions, (transaction) => transaction.blockNumber, [this.order]);
      // default:
      //   return [];
      // }
      return orderBy(this.transactions, (transaction) => transaction.blockNumber, [this.order]);
    },
    // withArrow () {
    //   return (from, label) => {
    //     if (this.from === from) {
    //       return this.order === 'desc' ? `${label} ↑` : `${label} ↓`;
    //     }
    //     return label;
    //   };
    // },
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
  /* margin-left: -5px; */
}

.history-table td, .history-table th {
  border-bottom: 1px dashed #e6eaee;
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
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  /* line-height: 1.54; */
  letter-spacing: 0.33px;
  color: #808992;
  text-align: center;
  height: 40px;
}

td {
  height: 38px;
  font-family: Roboto;
  font-size: 13px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: center;
  color: #304156;
}

.link {
  padding-left: 3px;
 font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: left;
  color: #2a72e5;
  text-decoration: none;
}
</style>
