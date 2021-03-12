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
      <ledger-connect
        :title="'Ledger'"
        :connect="ledger"
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
import ledgerConnect from '@/components/LedgerConnect.vue';

import WalletConnectProvider from '@walletconnect/web3-provider';

import EthereumTx from 'ethereumjs-tx';
import AppEth from '@ledgerhq/hw-app-eth';

import HookedWalletSubprovider from 'web3-provider-engine/dist/es5/subproviders/hooked-wallet';

import createLedgerSubprovider from '@ledgerhq/web3-subprovider';
import TransportWebUSB from '@ledgerhq/hw-transport-u2f';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc';
import * as HDKey from 'hdkey';
// import LedgerWalletSubproviderFactory from 'ledger-wallet-provider';


export default {
  components: {
    'wallet': Wallet,
    'wallet-connect': walletConnect,
    'ledger-connect': ledgerConnect,
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
    async ledger () {
      const engine = new ProviderEngine();

      const transport = await TransportWebUSB.create();
      transport.setDebugMode(true);
      const appEth = new AppEth(transport);
      // let address;
      // let derivedKey, accountPath;

      const isSupported = await TransportWebUSB.isSupported();
      console.log(isSupported);

      const rootPub = await appEth.getAddress('44\'/60\'/0\'/0/0', false, true);
      // .then(o => {
      //   address = o.address;
      // });

      const hdKey = new HDKey();
      hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
      const derivedKey = hdKey.derive('m/0/0');
      console.log(derivedKey);

      const address = rootPub.address;

      const ledger = createLedgerSubprovider(transport, {
        networkId: 1,
        accountsLength: 5,
        paths:  ['44\'/60\'/x\'/0/0'],
      });
      // console.log(ledger);
      // const addresses = await new Promise((resolve, reject) =>
      //   ledger.getAccounts((err, addresses) =>
      //     err ? reject(err) : resolve(addresses)
      //   )
      // );
      // console.log(addresses);
      // console.log(ledger.getAccounts);
      engine.addProvider(ledger);
      engine.addProvider(new RpcSubprovider({ rpcUrl: 'https://mainnet.infura.io/v3/3c55b12f39c549c7911f6488d8888260' }));
      engine.start();
      // console.log(engine); // eslint-disable-line
      const web3 = new Web3(engine); // eslint-disable-line
      // console.log((await web3.eth.getAccounts())[0]);
      // web3.eth.getAccounts(console.log);
      console.log(await web3.eth.net.getId());
      console.log(web3);
      console.log(web3.currentProvider);
      console.log(await web3.eth.getBalance(address));
      await this.$store.dispatch('signInLedger', web3, address);
      this.currentAccount = address;
      // try {
      //   await this.$store.dispatch('signIn', web3);
      //   this.currentAccount = address;
      // } catch (e) {
      //   throw new Error(e.message);
      // }

      // try {
      //   engine.on('chainChanged', (chainId) => {
      //     this.$store.dispatch('logout');
      //     this.$router.replace({
      //       path: '/',
      //       query: { network: this.$route.query.network },
      //     }).catch(err => {});
      //   });
      //   engine.on('accountsChanged', (account) => {
      //     if (this.user.toLowerCase() !== account[0].toLowerCase()) {
      //       this.$store.dispatch('logout');
      //       this.$router.replace({
      //         path: '/',
      //         query: { network: this.$route.query.network },
      //       }).catch(err => {});
      //     }
      //   });
      //   engine.on('disconnect', (code, reason) => {
      //     alert('Ethereum Provider connection lost');
      //     this.$store.dispatch('logout');
      //     this.$router.replace({
      //       path: '/',
      //       query: { network: this.$route.query.network },
      //     }).catch(err => {});
      //   });
      // } catch (e) {
      //   alert(e.message);
      // }
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
    async handleAccountsChanged (accounts, provider) {
      if (accounts.length === 0) {
        alert('Please connect to MetaMask.');
      } else if (accounts[0] !== this.currentAccount) {
        // const provider = window.ethereum;
        // console.log(await provider.request());
        const web3 = new Web3(provider);
        console.log((await web3.eth.getAccounts())[0]);
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
