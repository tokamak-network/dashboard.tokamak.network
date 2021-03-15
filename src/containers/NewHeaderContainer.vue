<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          class="header-logo"
          src="@/assets/images/tokamak-staking-simple.png"
          width="258"
          height="38"
          alt="Tokamak Logo"
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
        <connect-modal />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
  height: 75px;
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
  border: 1px solid #d7d9df;
  border-radius: 12px;
  padding: 0px 16px;
  height: 36px;
  color: #86929d;
  background-color: transparent;
  font-size: 14px;
  font-family: "Noto Sans",sans-serif;
  width: 150px;
  cursor: pointer;
}

.menu-button-selected {
  color: #1e4072;
}
</style>
