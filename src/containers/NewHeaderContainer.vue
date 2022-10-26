<template>
  <div class="header-container">
    <div class="menu-header">
      <div class="header-logo-container">
        <img
          alt="Tokamak Network Logo"
          class="header-logo"
          src="@/assets/images/tn_ss_bi.png"
          width="362px"
          heigh="39px"
          @click="toMainPage"
        >
      </div>
      <div class="link-container" style="margin-left: -10vw">
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
          :class="{ 'menu-button-selected': $route.path === '/wallet'}"
          @click="signIn?clickMenu('wallet'): showPopUp()"
        >
          Wallet
        </button>
        <button
          class="header-link"
          :class="{ 'menu-button-selected': $route.path === '/support'}"
          @click="clickMenu('support')"
        >
          Support
        </button>
      </div>
      <div style="margin-right:40px">
        <connect-modal />
      </div>
    </div>
    <transition v-if="showModel" name="model">
      <div class="model-mask">
        <div class="model-container">
          <WalletPopUp @closePopup="closePopup" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ConnectModal from '@/components/ConnectModal.vue';
import WalletPopUp from '@/components/WalletPopUp.vue';
import '@fontsource/open-sans';

export default {
  components: {
    ConnectModal,
    WalletPopUp,
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
    closePopup () {
      this.showModel = !this.showModel;
    },
    toMainPage () {
      if (this.signIn && this.$route.path !== '/home') {
        this.$router.push({
          path: '/home',
          query: { network: this.$route.query.network },
        }).catch(err => {});
      } else if(!this.signIn && this.$route.path !== '/home') {
        this.$router.push({
          path: '/home',
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
  /* border-top: 4px solid #2a72e5; */
}
.menu-header {
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
  font-family: "Open Sans";
  font-size: 16px;
  font-weight: 600;
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
.model-leave-active {
  opacity: 0;
}
.model-container {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
    transition: all 0.3s ease;
}
.model-enter .model-container,
.model-leave-active .model-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
