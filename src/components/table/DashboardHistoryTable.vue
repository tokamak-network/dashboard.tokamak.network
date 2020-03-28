<template>
  <table class="dashboard-history-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-right">Type</th>
        <th class="text-right">Amount</th>
        <th class="text-center">Transaction Hash</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(transaction, index) in transactions" :key="transaction.transactionHash">
        <td class="text-center">{{ index }}</td>
        <td class="text-right">{{ transactionType(transaction) }}</td>
        <td class="text-right">{{ convertedTONFromWTON(amount(transaction)) }}</td>
        <td class="text-center">{{ transaction.transactionHash | hexSlicer }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'web3',
      'transactions',
    ]),
    transactionType () {
      return transaction => {
        const Deposited = this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256)');
        const WithdrawalRequested = this.web3.eth.abi.encodeEventSignature('WithdrawalRequested(address,address,uint256)');
        const WithdrawalProcessed = this.web3.eth.abi.encodeEventSignature('WithdrawalProcessed(address,address,uint256)');

        let type = '-';

        const logs = transaction.logs;
        if (logs) {
          loop1:
          for (const log of logs) {
            for (const topic of log.topics) {
              switch (topic) {
              case Deposited:
                type ='deposited';
                break loop1;

              case WithdrawalRequested:
                type = 'requested';
                break loop1;

              case WithdrawalProcessed:
                type = 'processed';
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

        let amount = _WTON('0');

        const logs = transaction.logs;
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
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
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
  border-top: solid 0.5px #dce2e5;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
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
