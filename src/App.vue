<template>
  <div id="app" class="app">
    <new-header-container />
    <div class="body-container">
      <div v-if="!signIn">
        <loading-spinner v-if="loading" />
        <access-wallet-layout v-else />
      </div>
      <div v-else>
        <main-layout />
      </div>
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
import AccessWalletLayout from '@/layouts/AccessWalletLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AccessWalletLayoutVue from '@/layouts/AccessWalletLayout.vue';
import NetworkGuideLayout from '@/layouts/NetworkGuideLayout.vue';

export default {
  components: {
    'loading-spinner': LoadingSpinner,
    'new-header-container': NewHeaderContainer,
    'footer-container': FooterContainer,
    'access-wallet-layout': AccessWalletLayout,
    'main-layout': MainLayout,
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
  created () {
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
