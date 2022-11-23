<template>
  <div id="app" class="app ">
    <tokamak-gnb/>
    <new-header-container class="show-on-desktop" />
    <div class="body-container show-on-desktop">
      <loading-spinner v-if="loading" />
      <div v-else :style="{ width: '100%' }">
        <main-layout />
      </div>
    </div>
    <footer-container class="show-on-desktop" />
    <mobile-layout class="show-on-mobile" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import NewHeaderContainer from '@/containers/NewHeaderContainer.vue';
import FooterContainer from '@/containers/FooterContainer.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import MobileLayout from '@/layouts/MobileLayout.vue';
import TokamakGNB from '@/containers/TokamakGNB.vue';

import Web3 from 'web3';
import { getConfig } from '../config';
export default {
  components: {
    'new-header-container': NewHeaderContainer,
    'footer-container': FooterContainer,
    'main-layout': MainLayout,
    'loading-spinner': LoadingSpinner,
    'mobile-layout': MobileLayout,
    'tokamak-gnb': TokamakGNB,
  },
  data () {
    return {
      message: '',
    };
  },
  computed: {
    ...mapState(['loading', 'signIn']),
    ...mapGetters(['initialState']),
  },
  async created () {
    // await this.useMetamask();
    await this.$store.dispatch('load');
    if (this.initialState && this.$route.path !== '/') {
      this.$router
        .replace({
          path: '/',
          query: { network: this.$route.query.network },
        })
        .catch((err) => {});
    }
    this.$store.watch(
      (_, getters) => getters.initialState,
      (logout) => {
        if (logout && this.$route.path !== '/') {
          this.$router
            .replace({
              path: '/',
              query: { network: this.$route.query.network },
            })
            .catch((err) => {});
        }
      }
    );
  },
  methods: {
    async useMetamask () {
      try {
        const web3 = await this.metamask();
        await this.$store.dispatch('load', web3);
        window.ethereum.on('chainIdChanged', (chainId) => {
          this.$store.dispatch('load', web3);
          this.$router
            .replace({
              path: '/home',
              query: { network: this.$route.query.network },
            })
            .catch((err) => {});
        });
        window.ethereum.on('accountsChanged', (account) => {
          this.$store.dispatch('logout');
          this.$router
            .replace({
              path: '/home',
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

<style>
* {
  margin: 0;
}

html,
body {
  background-color: #fafbfc;
  position: relative;
  margin: 0;
  min-height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  width: 100%;
}

.body-container {
  min-width: 100%;
  max-width: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
