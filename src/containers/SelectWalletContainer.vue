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
        :connect="show"
      />
      <modal v-if="showModalAccounts"
             :width="'30%'"
      >
        <template #body>
          <modal-accounts
            :hardwareWallet="hardwareWallet"
            :accounts="HDAccounts"
            @on-closed="showModalAccounts=false"
          />
        </template>
      </modal>
      <modal v-if="showModalClaim"
             :width="'30%'"
      >
        <template #body>
          <ledger-modal
            @on-closed="showModalClaim=false"
            @hardwareWalletOpen="hardwareWalletOpen"
          />
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Web3 from 'web3';
import { getConfig } from '../../config.js';
import { setProvider } from '@/helpers/Contract';

import { mapState, mapActions } from 'vuex';
import Wallet from '@/components/Wallet.vue';
import walletConnect from '@/components/WalletConnect.vue';
import ledgerConnect from '@/components/LedgerConnect.vue';
import NetworkAndAddressModal from '@/layouts/AccessWalletLayout/NetworkAndAddressModal';
import Modal from '@/components/Modal.vue';
import ModalAccount from '@/containers/ModalAccounts.vue';
import LedgerModal from '@/layouts/AccessWalletLayout/LedgerAppModal/LedgerModal.vue';

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
    'modal': Modal,
    'ledger-modal': LedgerModal,
    'modal-accounts': ModalAccount,
    // 'network-and-address-modal': NetworkAndAddressModal,
  },
  data () {
    return {
      currentAccount : null,
      showModalClaim: false,
      showModalAccounts: false,
      hardwareWallet: {},
      hardwareAddresses: [],
      HDAccounts: [],
    };
  },
  computed: {
    ...mapState([
      'user',
      'web3',
    ]),
  },
  methods: {
    ...mapActions([
      'setWeb3Instance',
    ]),
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
    async hardwareWalletOpen (wallet) {
      const path = 'm/44\'/60\'';
      try {
        this.hardwareWallet = wallet;
        // console.log(this.hardwareWallet);
        this.hardwareWallet.init(path).then(() => {
          this.getPaths();
          this.currentIndex = 0;
          this.setHDAccounts();
        });
        this.networkAndAddressOpen();
      } catch (e) {
        alert(e);
      }
    },
    async setHDAccounts () {
      try {
        if (!this.web3.eth) this.setWeb3Instance();
        this.HDAccounts = [];
        for (let i = 0; i < 10; i++) {
          const account = await this.hardwareWallet.getAccount(i);
          this.HDAccounts.push({
            index: i,
            account: account,
          });
        }
        this.currentIndex += 5;
      } catch (e) {
        console.log(e);  // eslint-disable-line
      }
    },
    getPaths () {
      this.selectedPath = this.hardwareWallet.getCurrentPath();
      this.availablePaths = this.hardwareWallet.getSupportedPaths();
    },
    networkAndAddressOpen () {
      this.showModalAccounts = true;
    },
    show () {
      this.showModalClaim = true;
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
