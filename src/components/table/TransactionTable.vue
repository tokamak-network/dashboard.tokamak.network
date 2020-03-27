<template>
  <table class="transaction-table">
    <caption>Recent Transactions</caption>
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Transaction Hash</th>
        <th class="text-right">State</th>
        <th class="text-right">Block Number</th>
        <th class="text-right">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(transaction, index) in recentTransactions" :key="transaction.transactionHash">
        <td class="text-center">{{ index }}</td>
        <td class="text-center">{{ transaction.transactionHash | hexSlicer }}</td>
        <td class="text-right">{{ transaction.status ? 'mined' : 'pending' }}</td>
        <td class="text-right">{{ transaction.blockNumber ? transaction.blockNumber : '-' }}</td>
        <td class="text-right">{{ transaction.status ? transaction.status : '-' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'recentTransactions',
    ]),
  },
};
</script>

<style scoped>
.transaction-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

.transaction-table td, .transaction-table th {
  border-top: 1px solid #555561;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

/* .transaction-table tr:nth-child(even){background-color: #f2f2f2;} */

tbody tr:hover {
  background-color: #ececec;
}

.pointer {
  cursor: pointer;
}

tbody .clickable {
  font-weight: bolder;
  text-decoration: underline;
}

.transaction-table th {
  text-align: left;
}

.transaction-table td {
  text-align: left;
}

.transaction-table .text-center {
  text-align: center;
}

.transaction-table .text-right {
  text-align: right;
}

caption {
  text-align: left;
  margin-bottom: 8px;
}

th {
  padding: 8px;
}

td {
  padding: 4px;
}
</style>
