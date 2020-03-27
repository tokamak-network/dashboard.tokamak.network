<template>
  <div class="account-container">
    <h4>Account</h4>
    <text-viewer :title="user" />
    <text-viewer style="margin-top: 16px;" :title="'Assets'" :content="ethBalance" />
    <text-viewer :title="''" :content="tonBalance" />
    <text-viewer :title="''" :content="power" />
    <text-viewer :title="'Rank'" :content="rank" />
    <transaction-table style="margin-top: 16px;" />
  </div>
</template>

<script>
import { findIndex } from 'lodash';

import { mapState, mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.vue';
import TransactionTable from '@/components/table/TransactionTable.vue';

export default {
  components: {
    'text-viewer': TextViewer,
    'transaction-table': TransactionTable,
  },
  computed: {
    ...mapState([
      'user',
      'ethBalance',
      'tonBalance',
      'power',
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    // TODO: check reactivity
    rank () {
      const account = this.rankedAccountsWithPower.find(account => account.address.toLowerCase() === this.user.toLowerCase());
      if (account) {
        return account.rank;
      } else {
        return '-';
      }
    },
  },
};
</script>

<style scoped>
h4 {
  padding: 0;
  margin: 0;
}
</style>
