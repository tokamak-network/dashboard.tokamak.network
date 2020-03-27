<template>
  <table class="transaction-table">
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
      <tr v-for="(transaction, index) in transactions" :key="transaction.transactionHash">
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
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'transactions',
    ]),
  },
};
</script>

<style scoped>
.transaction-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.transaction-table td, .transaction-table th {
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
