<template>
  <div class="select-wallet-container">
    <div class="wallet-header-title">
      Login
    </div>
    <div class="wallet-container">
      <wallet
        :title="'MetaMask'"
        :image="'Metamask.jpg'"
        :connect="useMetamask"
      />
      <wallet-connect
        :title="'WalletConnect'"
        :image="'walletConnect.svg'"
        :connect="walletConnect"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Web3 from 'web3';
import { getConfig } from '../../config.js';
import { setProvider } from '@/helpers/Contract';

import { mapState } from 'vuex';
import Wallet from '@/components/Wallet.vue';
import walletConnect from '@/components/WalletConnect.vue';
// import WalletConnect from '@walletconnect/client';
import WalletConnectProvider from '@walletconnect/web3-provider';

export default {
  components: {
    'wallet': Wallet,
    'wallet-connect': walletConnect,
  },
  data () {
    return {
      currentAccount : null,
    };
  },
  computed: {
    ...mapState([
      'user',
    ]),
  },
  methods: {
    async useMetamask () {
      try {
        const web3 = await this.metamask();
        window.ethereum.on('chainChanged', (chainId) => {
          this.$store.dispatch('logout');
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        });
        window.ethereum.on('accountsChanged', (account) => {
          if (this.user.toLowerCase() !== account[0].toLowerCase()) {
            this.$store.dispatch('logout');
            this.$router.replace({
              path: '/',
              query: { network: this.$route.query.network },
            }).catch(err => {});
          }
        });
        window.ethereum.on('disconnect', (code, reason) => {
          alert('Ethereum Provider connection lost');
          this.$store.dispatch('logout');
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        });
      } catch (e) {
        alert(e.message);
      }
    },
    async walletConnect () {
      const provider = new WalletConnectProvider({
        infuraId: '34448178b25e4fbda6d80f4da62afba2',
        // bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
      });
      await provider.enable();

      try {
        this.handleAccountsChanged(provider.accounts[0], provider);
      } catch (e) {
        throw new Error(e.message);
      }

      // if (typeof provider !== 'undefined') {
      //   try {
      //     provider.request({ method: 'eth_requestAccounts' })
      //       .then(this.handleAccountsChanged)
      //       .catch((err) => {
      //         if (err.code === 4001) {
      //           alert('Please connect to WalletConnect.');
      //         } else {
      //           alert(err);
      //         }
      //       });
      //   } catch (e) {
      //     if (e.stack.includes('Error: User denied account authorization')) {
      //       throw new Error('User denied account authorization');
      //     } else {
      //       throw new Error(e.message);
      //     }
      //   }
      // } else {
      //   throw new Error('No web3 provider detected');
      // }
      const networkVersion = await provider.request({ method: 'net_version' });
      if (networkVersion.toString() !== getConfig().network) {
        throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
      }
      const web3 = new Web3(provider);

      try {
        provider.on('chainChanged', (chainId) => {
          this.$store.dispatch('logout');
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        });
        provider.on('accountsChanged', (account) => {
          if (this.user.toLowerCase() !== account[0].toLowerCase()) {
            this.$store.dispatch('logout');
            this.$router.replace({
              path: '/',
              query: { network: this.$route.query.network },
            }).catch(err => {});
          }
        });
        provider.on('disconnect', (code, reason) => {
          alert('Ethereum Provider connection lost');
          this.$store.dispatch('logout');
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        });
      } catch (e) {
        alert(e.message);
      }
      // provider.disconnect();
    },
    async metamask () {
      let provider;
      if (typeof window.ethereum !== 'undefined') {
        try {
          provider = window.ethereum;

          provider.request({ method: 'eth_requestAccounts' })
            .then(this.handleAccountsChanged(provider.selectedAddress, provider))
            .catch((err) => {
              if (err.code === 4001) {
                alert('Please connect to MetaMask.');
              } else {
                alert(err);
              }
            });
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
      const networkVersion = await provider.request({ method: 'net_version' });
      if (networkVersion.toString() !== getConfig().network) {
        throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
      }
      const web3 = new Web3(provider);
      return web3;
    },
    async handleAccountsChanged (accounts, provider){
      if (accounts.length === 0) {
        alert('Please connect to MetaMask.');
      } else if (accounts[0] !== this.currentAccount) {
        // const provider = window.ethereum;
        const web3 = new Web3(provider);
        const networkVersion = await provider.request({ method: 'net_version' });
        if (networkVersion.toString() !== getConfig().network) {
          throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
        }
        await this.$store.dispatch('signIn', web3);
        this.currentAccount = accounts[0];
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
