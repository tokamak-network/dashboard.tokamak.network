<template>
  <div class="dashboard-header-container">
    <wallet-info
      :title="'Account'"
      :info="account"
    />
    <wallet-info
      :title="'Balance'"
      :info="balance"
    />
    <wallet-info
      :title="'Network'"
      :info="networkId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import WalletInfo from '@/components/WalletInfo.vue';

export default {
  components: {
    'wallet-info': WalletInfo,
  },
  computed: mapState([
    'account',
    'networkId',
    'balance',
  ]),
};
</script>

<style>
.dashboard-header-container {
  display: flex;
  justify-content: space-between;
}
</style>
