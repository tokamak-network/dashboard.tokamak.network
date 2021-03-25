<template>
  <div id="app" class="app">
    <new-header-container />
    <div class="body-container">
      <loading-spinner v-if="loading" />
      <main-layout v-else />
    </div>
    <footer-container />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

// import TxProcessor from '@/components/TxProcessor.vue';
import NewHeaderContainer from '@/containers/NewHeaderContainer.vue';
import FooterContainer from '@/containers/FooterContainer.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import Web3 from 'web3';
import { getConfig } from '../config';
export default {
  components: {
    'new-header-container': NewHeaderContainer,
    'footer-container': FooterContainer,
    'main-layout': MainLayout,
    'loading-spinner': LoadingSpinner,
  },
  data () {
    return {
      message: '',
    };
  },
  computed: {
    ...mapState([
      'loading',
      'signIn',
    ]),
    ...mapGetters([
      'initialState',
    ]),
  },
  async created () {
    await this.useMetamask();
    if (this.initialState && this.$route.path !== '/') {
      this.$router.replace({
        path: '/',
        query: { network: this.$route.query.network },
      }).catch(err => {});
    }
    this.$store.watch(
      (_, getters) => getters.initialState,
      (logout) => {
        if (logout && this.$route.path !== '/') {
          this.$router.replace({
            path: '/',
            query: { network: this.$route.query.network },
          }).catch(err => {});
        }
      },
    );
  },
  methods:{
    async useMetamask () {
      try {
        const web3 = await this.metamask();
        await this.$store.dispatch('load', web3);
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
  },
};
</script>

<style>
* {
  margin: 0;
}

html, body {
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

/* GLOBAL CSS */
.delegate-button-container {
  display: flex;
}

.delegate-button {
  width: 102px;
  height: 30px;
  line-height: 30px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px #dce2e5;
  background-color: #73a9c1;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
}

.undelegate-button {
  width: 102px;
  height: 30px;
  line-height: 30px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px #dce2e5;
  background-color: #ef8f78;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
  text-align: center;
  margin-right: 20px;
}

.delegate-button:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}

.undelegate-button:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}

/* GLOBAL CONTAINER */
.table-container {
  min-height: 264px;
  max-height: 264px;
}

.loading-container-in-dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 284px;
}
</style>
