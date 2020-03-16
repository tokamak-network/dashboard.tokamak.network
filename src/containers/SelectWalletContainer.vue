<template>
  <div class="select-wallet-container">
    <div class="wallet-header-title">
      Sellect Wallet
    </div>
    <div class="wallet-container">
      <wallet
        :title="'MetaMask'"
        :image="'Metamask.jpg'"
        :connect="useMetamask"
      />
    </div>
  </div>
</template>

<script>
import Web3 from 'web3';

import Wallet from '@/components/Wallet.vue';

export default {
  components: {
    'wallet': Wallet,
  },
  methods: {
    async useMetamask () {
      try {
        await this.metamask();

        window.ethereum.on('chainIdChanged', (chainId) => {
          this.$store.dispatch('logout');
        });
        window.ethereum.on('accountsChanged', (chainId) => {
          this.$store.dispatch('logout');
        });
      } catch (e) {
        alert(e.message);
        this.$store.dispatch('logout');
      }
    },
    async metamask () {
      let provider;
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.enable();
          provider = window.ethereum;
        } catch (e) {
          if (e.stack.includes('Error: User denied account authorization')) {
            throw new Error('User denied account authorization');
          } else {
            throw new Error(e.message);
          }
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else {
        throw new Error('No web3 provider detected');
      }

      await this.$store.dispatch('signIn', new Web3(provider));
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
