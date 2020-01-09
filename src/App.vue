<template>
  <div
    id="app"
  >
    <header-container />
    <div class="container_12">
      <main-layout v-if="isWalletConnected" />
      <access-wallet-layout v-else />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import HeaderContainer from '@/containers/HeaderContainer.vue';
import AccessWalletLayout from '@/layouts/AccessWalletLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import AccessWalletLayoutVue from './layouts/AccessWalletLayout.vue';

export default {
  components: {
    'header-container': HeaderContainer,
    'access-wallet-layout': AccessWalletLayout,
    'main-layout': MainLayout,
  },
  computed: mapState([
    'isWalletConnected',
  ]),
};
</script>

<style>
body {
  background: #f6f8f9;
}

#app {
  height: 100%;
}
</style>
