<template>
  <div
    id="app"
  >
    <header-container />
    <div class="container_12">
      <access-wallet-layout v-if="$route.path === '/'" />
      <main-layout v-else />
    </div>
    <footer-container />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isNull } from 'lodash';

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
    'web3',
  ]),
  created () {
    if (isNull(this.web3) && this.$route.path !== '/') {
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
  font-size: 12px;
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
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
  text-align: center;
  margin-right: 20px;
}

.delegate-button:hover {
  cursor: pointer;
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}

.undelegate-button:hover {
  cursor: pointer;
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
