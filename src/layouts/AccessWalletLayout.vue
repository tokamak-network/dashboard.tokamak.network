<template>
  <div class="access-wallet-layout">
    <button class="login" @click="login">Unlock Wallet</button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3 from 'web3';
import { getConfig } from '../../config.js';

export default {
  computed: {
    ...mapState(['signIn']),
  },
  methods: {
    async login () {
      if (this.loading) return;
      this.loading = true;
      await this.useMetamask();
      this.loading = false;
    },
    async useMetamask () {
      try {
        const web3 = await this.metamask();
        await this.$store.dispatch('signIn', web3);

        window.ethereum.on('chainIdChanged', (chainId) => {
          this.$store.dispatch('logout');
          this.$router
            .replace({
              path: '/',
              query: { network: this.$route.query.network },
            })
            .catch((err) => {});
        });
        window.ethereum.on('accountsChanged', (account) => {
          this.$store.dispatch('logout');
          this.$router
            .replace({
              path: '/',
              query: { network: this.$route.query.network },
            })
            .catch((err) => {});
        });
      } catch (e) {
        alert(e.message);
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

      if (provider.networkVersion !== getConfig().network) {
        throw new Error(
          `Please connect to the '${this.$options.filters.nameOfNetwork(
            getConfig().network
          )}' network`
        );
      }

      return new Web3(provider);
    },
  },
};
</script>

<style scoped>
.access-wallet-layout {
  min-width: 1174px;
  max-width: 1174px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  border: 1px solid #1e4072;
  background: #e2e8eb;
  border-radius: 12px;
  box-shadow: 6px 6px 12px #d1d1d1;
  padding: 0px 16px;
  height: 36px;
  color: #2a72e5;
  font-size: 14px;
  font-weight: 700;
  font-family: "Noto Sans", sans-serif;
  width: 150px;
}

button:focus {
  outline: none;
}
button:hover {
  color: #555555;
}
</style>
