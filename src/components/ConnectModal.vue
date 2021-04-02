<template>
  <div>
    <div v-if="!signIn && !loadingAccount" class="wallet-connect" @click="openWalletOptions()">Connect Wallet</div>
    <div v-else-if="signIn && !pendingTx" class="wallet-connect" @click="openWallet()">
      <blockies :address="user" />
      {{ user | hexSlicer }}
    </div>
    <div v-else-if="loadingAccount" class="wallet-connect">
      <div class="loading-spinner-container">
        <div class="loading-spinner" />
      </div>
    </div>
    <div v-else-if="pendingTx" class="tx-processor">
      <div class="loader" />
      <div class="label">Tx PENDING</div>
    </div>
    <transition v-if="showConnectModal" name="modal">
      <div class="modal-mask w100">
        <div class="">
          <div>
            <div v-if="connectType === 'connect'" class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header">
                  <div class="modal-header-container">
                    <h3>Connect Wallet</h3>
                    <img class="close-icon" src="@/assets/images/popup_close_s_icon.png" @click="close()">
                  </div>
                  <span>To start Staking</span>
                </div>

                <div class="modal-body">
                  <div class="wallet-options">
                    <div v-for="(wallet, index) in wallets" :key="index" class="wallet-option" @click="wallet.onClick()">
                      <img class="wallet-option__image" :src="wallet.img" :alt="wallet.name">
                      <div class="wallet-option__inner w100">
                        <span>{{ wallet.name }}</span>
                        <img class="wallet-option__arrow" src="@/assets/images/right_arrow.png" alt="Right Arrow">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <h3>New to Ethereum?</h3>
                  <a href="https://ethereum.org/en/wallets/" target="_blank" class="link">Learn more about wallets</a>
                </div>
              </div>
            </div>
            <div v-else class="modal-wrapper">
              <div class="modal-container">
                <div class="modal-header">
                  <div class="modal-header-container">
                    <h3>Account</h3>
                    <img class="close-icon" src="@/assets/images/popup_close_s_icon.png" @click="close()">
                  </div>
                  <span>My account & connect change</span>
                </div>

                <div class="modal-body">
                  <div class="wallet-options">
                    <div class="wallet-option">
                      <div class="wallet-option__inner">
                        <span>{{ user | hexSlicer }}</span>
                        <img src="@/assets/images/account_copy_icon.png" alt="Right Arrow" @click="copyToClipboard">
                        <img src="@/assets/images/etherscan_link_icon.png" alt="Right Arrow" @click="openEtherscanLink">
                      </div>
                    </div>
                    <div class="wallet-option">
                      <div class="wallet-option__inner">
                        <div class="connection-type">
                          Connected with {{ walletType }}
                          <button class="change-cta" @click="setConnectType('connect')">Change</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <div class="logout" @click="logout()">Logout</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { mapState } from 'vuex';
import { getConfig } from '../../config.js';
import Blockies from '@/components/Blockies.vue';
import MetamaskIcon from '../assets/images/metamask_icon.png';
import WalletConnectIcon from '../assets/images/walletconnect_icon.png';

export default {
  components: {
    Blockies,
  },
  data () {
    return {
      web: null,
      showConnectModal: false,
      connectType: 'connect',
      wallets: [{
        name: 'Metamask',
        img: MetamaskIcon,
        onClick: this.handleMetamask,
      }, {
        name: 'WalletConnect',
        img: WalletConnectIcon,
        onClick: this.handleWalletConnect,
      } ],
    };
  },
  computed: {
    ...mapState([
      'signIn',
      'user',
      'loadingAccount',
      'pendingTx',
    ]),
    walletType () {
      return window.ethereum.isMetaMask ? 'Metamask' : 'WalletConnect';
    },
  },
  beforeMount () {
    window.addEventListener('mousedown', (event) => {
      if (!event.target.closest('.wallet-connect')) {
        if (!event.target.closest('.modal-mask')) {
          this.showConnectModal = false;
        }
      }
    });
    window.ethereum.on('networkChanged', (chainId) => {
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', (account) => {
      this.$store.dispatch('signIn', new Web3(window.ethereum));
    });
  },
  methods: {
    async handleMetamask () {
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
        this.showConnectModal = false;
      } else {
        throw new Error('No web3 provider detected');
      }
      if (provider.networkVersion !== getConfig().network) {
        throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
      }

      this.showConnectModal = false;
      const web3 = new Web3(provider);
      await this.$store.dispatch('signIn', web3);

    },
    async handleWalletConnect () {
      const provider = new WalletConnectProvider({
        infuraId: '34448178b25e4fbda6d80f4da62afba2',
        bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
      });
      await provider.enable();
      try {
        this.handleAccountsChanged(provider.accounts[0], provider);
        this.showConnectModal = false;
      } catch (e) {
        throw new Error(e.message);
      }
      const web3 =  new Web3(provider);
      await this.$store.dispatch('signIn', web3);
    },
    async handleAccountsChanged (accounts, provider){
      if (accounts.length === 0) {
        alert('Please connect to MetaMask.');
      } else if (accounts[0] !== this.currentAccount) {
        const web3 = new Web3(provider);
        const networkVersion = await provider.request({ method: 'net_version' });
        if (networkVersion.toString() !== getConfig().network) {
          throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
        }
        this.showConnectModal = false;
        await this.$store.dispatch('signIn', web3);
        this.currentAccount = accounts[0];
      }
    },
    async logout () {
      this.showConnectModal = false;
      // this.$store.dispatch('SIGN_OUT');
      // await provider.disconnect();
      this.$store.dispatch('logout');
      // this.$router.replace({
      //   path: '/',
      //   query: { network: this.$route.query.network },
      // }).catch(err => {});
    },
    openEtherscanLink () {
      window.open(`https://etherscan.io/address/${this.user}`);
    },
    copyToClipboard () {
      this.$copyText(this.user);
    },
    openWalletOptions () {
      this.showConnectModal = true;
      this.connectType = 'connect';
    },
    openWallet () {
      this.showConnectModal = true;
      this.connectType = 'wallet';
    },
    setConnectType (connectType) {
      this.connectType = connectType;
    },
    close () {
      this.showConnectModal= false;
    },
  },
};
</script>

<style scoped>
.wallet-connect {
  border: 1px solid #d7d9df;
  border-radius: 19px;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  height: 33px;
  color: #86929d;
  background-color: transparent;
  font-size: 14px;
  font-family: "Titillium Web", sans-serif;
  cursor: pointer;
  margin-right: 40px;
  width: 185px;
  justify-content: center;
}

.modal {
  z-index: 10000;
}
.tx-processor {
  border-radius: 19px;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  height: 33px;
  color: #86929d;
  background-color: transparent;
  font-size: 14px;
  font-family: "Titillium Web", sans-serif;
  cursor: pointer;
  width: 185px;
  justify-content: center;
  /* width: 150px; */
  /* height: 33px; */
  border: solid 1px #2a72e5;
  margin-right: 40px;

}
.loader {
  width: 14px;
  height: 14px;

  border: 2px solid #d9e6fb;
  border-top: 2px solid #2a72e5;
  border-radius: 50%;

  animation: spin 2s linear infinite;

  margin-right: 16px;
  margin-left: -12px;
}
.label {
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #2a72e5;
}
.modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  height: 100%;
  display: table;
  transition: opacity 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);}

.modal-wrapper {
  position: fixed;
  top: 90px;
  right: 90px;
}

.modal-container {
  width: 280px;
  margin: 0px auto;
  background-color: #fff;
  transition: all 0.3s ease;
  border-radius: 15px;
}

.modal-header {
  padding: 15px 25px;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
}

.modal-header span {
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #86929d;
}
.loading-spinner-container {
  min-height: 100%;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.modal-footer {
  padding: 15px 25px;
}

.link {
  text-decoration: underline;
font-family: "Titillium Web", sans-serif;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.31;
  letter-spacing: normal;
  text-align: left;
  color: #2a72e5;
}
.modal-footer h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}
.modal-header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.wallet-options {
  display: flex;
  flex-direction: column;
}

.wallet-option {
  display: flex;
  border-top: 1px solid #f4f6f8;
  border-bottom: 1px solid #f4f6f8;
  padding: 20px;
  cursor: pointer;
  outline: none;
}

.wallet-option__image {
  width: 30px;
  height: 30px;
  margin: 0 15px 0 0;
  object-fit: contain;
}

.wallet-option__inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.close-icon {
  height: 22px;
  width: 22px;
}
.wallet-option__inner span {
  font-family: "Noto Sans",sans-serif;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.31;
  letter-spacing: 0.33px;
  text-align: left;
  color: #3d495d;
}

.wallet-option__inner img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  cursor: pointer;
}

.logout {
  color: #2a72e5;
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
}

.w100 {
  width: 100%;
}

.connection-type {
  font-size: 13px;
  font-weight: normal;
  color: #3d495d;
  cursor: default;
}

.change-cta {
  width: 58px;
  height: 22px;
  border-radius: 4px;
  background-color: #257eee;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px #dce2e5;
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
}

button:focus {
outline: none;
}
</style>
