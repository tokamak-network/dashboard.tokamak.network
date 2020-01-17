<template>
  <div
    id="app"
  >
    <header-container />
    <div class="container_12">
      <access-wallet-layout v-if="!isWalletConnected" />
      <main-layout v-else />
    </div>
    <footer-container />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import HeaderContainer from '@/containers/HeaderContainer.vue';
import FooterContainer from '@/containers/FooterContainer.vue';
import AccessWalletLayout from '@/layouts/AccessWalletLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AccessWalletLayoutVue from './layouts/AccessWalletLayout.vue';

export default {
  components: {
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'access-wallet-layout': AccessWalletLayout,
    'main-layout': MainLayout,
  },
  computed: mapState([
    'isWalletConnected',
  ]),
  created () {
    if (!this.isWalletConnected && this.$route.path !== '/') {
      this.$router.replace('/');
    }
  },
};
</script>

<style>
* {
  margin: 0;
}

html, body {
  background: #f6f8f9;
  position: relative;
  margin: 0;
  min-height: 100%;
}

#app {
  min-height: 100vh;
}
</style>
