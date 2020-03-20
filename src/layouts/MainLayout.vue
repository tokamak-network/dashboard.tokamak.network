<template>
  <div class="main-layout">
    <menu-container />
    <div class="main-container">
      <wallet-info-container />
      <router-view />
    </div>
  </div>
</template>

<script>
import WalletInfoContainer from '@/containers/WalletInfoContainer.vue';
import MenuContainer from '@/containers/MenuContainer.vue';

export default {
  components: {
    'menu-container': MenuContainer,
    'wallet-info-container': WalletInfoContainer,
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  width: 100%;
  padding-top: 16px;
  padding-bottom: 2rem;
}

.main-container {
  padding-left: 16px;
  width: 100%;
  position: relative;
}
</style>
