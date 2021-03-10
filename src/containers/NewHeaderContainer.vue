<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          class="header-logo"
          src="@/assets/images/tokamak-staking-simple.png"
          width="258"
          height="38"
          @click="toMainPage"
        >
      </div>
      <div class="link-container">
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/home'}"
          @click="clickMenu('home')"
        >
          Home
        </button>
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/menu'}"
          @click="clickMenu('menu')"
        >
          Operators
        </button>
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/staking'}"
          @click="clickMenu('staking')"
        >
          Staking
        </button>
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/powerton'}"
          @click="clickMenu('powerton')"
        >
          Power TON
        </button>
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/about'}"
          @click="clickMenu('about')"
        >
          About Us
        </button>
      </div>
      <div>
        <button v-if="!signIn" class="login" @click="login">Unlock Wallet</button>
        <button v-else class="login" @click="showPopUp">My Wallet</button>
      </div>

      <transition v-if="showModel" name="model">
        <div class="model-mask">
          <div class="model-container">
            <WalletContainer @showPopUp="showPopUp" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3 from 'web3';
import { getConfig } from '../../config.js';
import { setProvider } from '@/helpers/Contract';
import WalletContainer from '@/containers/WalletContainer.vue';
export default {
  components: {
    WalletContainer,
  },
  data () {
    return {
      loading: false,
      showModel: false,
    };
  },
  computed: {
    ...mapState([
      'signIn',
    ]),
  },
  methods: {
    clickMenu (path) {
      if (`/${path}` === this.$route.path) {
        return;
      }
      this.$router.push({
        path: `/${path}`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
    },
    showPopUp () {
      this.showModel = !this.showModel;
    },
    async login (){
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
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        });
        window.ethereum.on('accountsChanged', (account) => {
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
        throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
      }

      return new Web3(provider);
    },
    toMainPage () {
      if (this.signIn && this.$route.path !== '/home') {
        this.$router.push({
          path: '/home',
          query: { network: this.$route.query.network },
        }).catch(err => {});
      } else if(!this.signIn && this.$route.path !== '/') {
        this.$router.push({
          path: '/',
          query: { network: this.$route.query.network },
        }).catch(err => {});
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  width: 100%;
  align-self: center;
  height: 84px;
  background: #f6f8f9;
  display: flex;
  justify-content: center;
  position:inherit;
}

.header {
    align-items: center;
    display: flex;
     width: 100%;
  height: 100%;
    justify-content: space-around;
}

.header-logo-container {
  display: block;
}

.header-logo {
  margin-top: -5px;
}

.header-logo:hover {
  cursor: pointer;
}

.link-container {
 -webkit-box-align: center;
  align-items: center;
  display: flex;
}

.header-link:hover {
  color: #555555;;
}

.header-link {
  border: none;
  font-weight: 550;
    padding-left: 16px;
    padding-right: 16px;
    text-decoration: none;
    background: #f6f8f9;
    color: #2a72e5;
    font-size: 16px;
    font-family: "Noto Sans",sans-serif;
}
button:focus {
  outline: none;
}
button:hover {
  color: #555555;
}
.login {
  border: 1px #519ae8;
  background: #e2e8eb;
  border-radius: 12px;
  box-shadow: 6px 6px 12px #d1d1d1;
  padding: 0px 16px;
  height: 36px;
  color: #2a72e5;
  font-size: 14px;
  font-weight: 700;
  font-family: "Noto Sans",sans-serif;
  width: 150px;
}
.menu-button-selected {
  color: #1e4072;
}
.model-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease;

}
.model-container {
  display: flex;
  justify-content: center;
    align-content: center;
    margin-top: 50px;
}
</style>
