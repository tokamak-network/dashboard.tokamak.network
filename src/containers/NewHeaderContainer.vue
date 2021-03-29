<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          alt="Tokamak Network Logo"
          class="header-logo"
          src="@/assets/images/tnss_bi.png"
          width="365px"
          heigh="39px"
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
          :class="{ 'menu-button-selected': $route.path === '/staking'}"
          @click="clickMenu('staking')"
        >
          Staking
        </button>
        <!-- <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/staking'}"
          @click="clickMenu('staking')"
        >
          Staking
        </button> -->
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/powerton'}"
          @click="clickMenu('powerton')"
        >
          PowerTON
        </button>
        <button
          v-if="signIn"
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/wallet'}"
          @click="clickMenu('wallet')"
        >
          Wallet
        </button>
      </div>
      <div>
        <connect-modal />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3 from 'web3';
import { getConfig } from '../../config.js';
import { setProvider } from '@/helpers/Contract';
import ConnectModal from '@/components/ConnectModal.vue';

export default {
  components: {
    ConnectModal,
  },
  data () {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState([
      'signIn',
      'user',
    ]),
    hexSlicer () {
      return address => this.$options.filters.hexSlicer(address);
    },
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
    // async login (){
    //   if (this.loading) return;
    //   this.loading = true;
    //   await this.useMetamask();
    //   this.loading = false;
    // },
    // async useMetamask () {
    //   try {
    //     const web3 = await this.metamask();
    //     await this.$store.dispatch('signIn', web3);

    //     window.ethereum.on('chainIdChanged', (chainId) => {
    //       this.$store.dispatch('logout');
    //       this.$router.replace({
    //         path: '/',
    //         query: { network: this.$route.query.network },
    //       }).catch(err => {});
    //     });
    //     window.ethereum.on('accountsChanged', (account) => {
    //       this.$store.dispatch('logout');
    //       this.$router.replace({
    //         path: '/',
    //         query: { network: this.$route.query.network },
    //       }).catch(err => {});

    //     });
    //   } catch (e) {
    //     alert(e.message);
    //   }
    // },
    // async metamask () {
    //   let provider;
    //   if (typeof window.ethereum !== 'undefined') {
    //     try {
    //       await window.ethereum.enable();
    //       provider = window.ethereum;
    //     } catch (e) {
    //       if (e.stack.includes('Error: User denied account authorization')) {
    //         throw new Error('User denied account authorization');
    //       } else {
    //         throw new Error(e.message);
    //       }
    //     }
    //   } else if (window.web3) {
    //     provider = window.web3.currentProvider;
    //   } else {
    //     throw new Error('No web3 provider detected');
    //   }

    //   if (provider.networkVersion !== getConfig().network) {
    //     throw new Error(`Please connect to the '${this.$options.filters.nameOfNetwork(getConfig().network)}' network`);
    //   }

    //   return new Web3(provider);
    // },
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
  background: #fafbfc;
  display: flex;
  justify-content: center;
  position:inherit;
}

.header {
    align-items: center;
    display: flex;
     width: 100%;
  height: 100%;
    justify-content: space-between;
}

.header-logo-container {
  display: block;
}

.header-logo {
  margin-top: -5px;
  margin-left: 40px;

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
  color: #2a72e5;;
}

.header-link {
  border: none;
    padding-left: 24px;
    padding-right: 24px;
    background: #fafbfc;
  font-family: "TitilliumWeb",sans-serif;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  /* line-height: 1.5; */
  letter-spacing: normal;
  text-align: center;
  color: #3e495c;
}

button:focus {
  outline: none;
}

button:hover {
  color: #555555;
}

.login {
  border: 1px solid #d7d9df;
  border-radius: 12px;
  padding: 0px 16px;
  height: 36px;
  color: #86929d;
  background-color: transparent;
  font-size: 14px;
  font-family: "Noto Sans",sans-serif;
  width: 150px;
  margin-right: 39px;
}

.menu-button-selected {
  color: #2a72e5;
}
</style>
