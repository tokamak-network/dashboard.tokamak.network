<template>
  <div>
    <div
      v-for="transaction in pendingTransactions"
      :key="transaction.transactionHash"
    >
      <div class="tx-processor">
        <p class="message">
          Pending transaction (
          <a
            class="header-link"
            target="_blank"
            rel="noopener noreferrer"
            :href="explorerURL(transaction.transactionHash)"
          >{{ transaction.transactionHash }}</a> ), waiting to be confirmed...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      prefix: '',
    };
  },
  computed: {
    ...mapState([
      'pendingTransactions',
    ]),
    explorerURL () {
      return hash => `${this.prefix}/${hash}`;
    },
  },
  created () {
    this.prefix = process.env.VUE_APP_EXPLORER_PREFIX;
  },
};
</script>

<style scoped>
.tx-processor {
  width: 960px;
  display: table;
  border-radius: 7px;
  border: solid 1px #ced6d9;
  background: red; height: 36px; background: #5ba7d8;
  color: white;
  margin-top: 8px;
  margin-bottom: -8px;
}

.message {
  padding-left: 16px;
  vertical-align: middle;
  display: table-cell;
}
</style>
