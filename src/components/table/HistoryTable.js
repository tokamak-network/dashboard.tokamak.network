
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
