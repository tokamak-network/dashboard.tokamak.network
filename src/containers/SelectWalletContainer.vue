<template>
  <div class="select-wallet-container">
    <div class="wallet-header-title">
      Sellect Wallet
    </div>
    <div
      class="wallet-container"
      @click="connectMetaMaskWallet"
    >
      <wallet
        :title="'MetaMask'"
        :image="'Metamask.jpg'"
        :loading="connecting"
      />
    </div>
  </div>
</template>

<script>
import mm from '@/helpers/wallets/metamask';

import Wallet from '@/components/Wallet.vue';

export default {
  components: {
    'wallet': Wallet,
  },
  data () {
    return {
      connecting: false,
    };
  },
  methods: {
    async connectMetaMaskWallet () {
      if (!this.connecting) {
        this.connecting = true;
        const walletInfo = await mm.accessMetamaskWallet();
        if (walletInfo.isConnected) {
          this.$store.dispatch('setWalletInfo', walletInfo);
          this.$router.replace('/dashboard');
        }
        this.connecting = false;
      }
    },
  },
};
</script>

<style scoped>
.select-wallet-container {
  display: flex;
  flex-direction: column;
  padding-left: 32px;
}

.wallet-header-title {
  font-family: OpenSeas;
  font-size: 20px;
  padding-left: 8px;
  padding-bottom: 2px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  text-align: left;
  color: #b2b7b9;
}
</style>
