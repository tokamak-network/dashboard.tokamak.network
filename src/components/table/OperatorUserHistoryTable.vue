<template>
  <div style="margin-left:-4px">
    <table class="history-table">
      <thead>
        <tr>
          <th class="text-center" style="width:135px">Account Address</th>
          <th class="text-center" style="width:100px">TX Hash</th>
          <th class="text-center" style="width:140px">Type</th>
          <th class="text-center" style="width:117px">Amount</th>
          <th class="text-center" style="width:237px">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in sorted" :key="transaction.transactionHash">
          <td
            class="text-center"
            style="width:119px; text-align: left; padding-left:2px"
          >
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('address', transaction.from)"
            >
              {{ transaction.from | hexSlicer }}
            </a>
          </td>
          <td
            class="text-center"
            style="width:100px; text-align: left; padding-left: 14px; padding-right:14px"
          >
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('transactionHash', transaction.transactionHash)"
            >
              {{ transaction.transactionHash | hexSlicer }}
            </a>
          </td>
          <td class="text-center" style="width:140px">
            {{ type(transaction.eventName) }}
          </td>
          <td class="text-center" style="width:117px">
            {{ currencyAmountFromNumberString(transaction.value) }}
          </td>
          <td class="text-center" style="width:237px">
            {{ transaction.blockTimestamp | formattedTimestamp }}
          </td>
        </tr>
      </tbody>
    </table>
    <table-paginate :datas="operatorHistroy" @on-selected="updateTableByPage" />
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
    operatorHistroy: {
      required: true,
      type: Array,
    },
  },
  data () {
    return {
      from: 'blockNumber',
      order: 'desc',
      page: 0,
    };
  },
  computed: {
    ...mapState(['web3']),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    formattedTimestamp () {
      return (timestamp) => this.$options.filters.formattedTimestamp(timestamp);
    },
    currencyAmountFromNumberString () {
      return (amount) => {
        return this.$options.filters.currencyAmountFromNumberString(
          'WTON',
          amount
        );
      };
    },
    sorted () {
      const first = this.page * 5;
      return this.operatorHistroy.slice(first, first + 5);
    },
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
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
    type (type) {
      if (type === 'WithdrawalRequested') {
        return 'Unstaked';
      }
      else if (type === 'Deposited') {
        return 'Staked';
      }
      else {
        return 'Withdrawn';
      }
    },
    changedOrder () {
      return this.order === 'desc' ? 'asc' : 'desc';
    },
    updateTableByPage (page) {
      this.page = page;
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

.history-table td,
.history-table th {
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
