<template>
  <div>
    <select-wallet-container />
    <button
      @click="accessMetaMaskWallet"
    >
      MetaMask
    </button>
  </div>
</template>

<script>
import SelectWalletContainer from '@/containers/SelectWalletContainer.vue';
import mm from '@/helpers/wallets/metamask';

export default {
  components: {
    'select-wallet-container': SelectWalletContainer,
  },
  methods: {
    async accessMetaMaskWallet () {
      const walletInfo = await mm.accessMetamaskWallet();
      if (walletInfo.isConnected) {
        this.$store.dispatch('setWalletInfo', walletInfo);
      }
    },
  },
};
</script>

<style>
</style>
