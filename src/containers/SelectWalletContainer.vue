<template>
  <div class="select-wallet-container">
    <div class="wallet-header-title">
      Sellect Wallet
    </div>

    <div class="wallet-container">
      <wallet
        :title="'개발용'"
        :image="'Metamask.jpg'"
      />
      <wallet
        :title="'MetaMask'"
        :image="'Metamask.jpg'"
        :connect="metamask"
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
    async metamask () {
      if (window.ethereum) {
        await window.ethereum.enable();

        window.ethereum.on('networkChanged', async (netId) => {
          this.$store.dispatch('logout');
        });
        window.ethereum.on('accountsChanged', async (account) => {
          this.$store.dispatch('logout');
        });
      } else {
        //
      }


      const provider = window.ethereum;
      await this.$store.dispatch('connect', new Web3(provider));
      await this.$store.dispatch('set');

      this.$router.replace('/dashboard');
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
