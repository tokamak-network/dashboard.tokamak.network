<template>
  <div>
    <button
      @click="accessMetaMaskWallet"
    >
      MetaMask
    </button>
  </div>
</template>

<script>
import mm from '@/helpers/wallets/metamask';

export default {
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
