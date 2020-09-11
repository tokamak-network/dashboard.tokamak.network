<template>
  <div class="access-wallet-layout">
    <popup />
    <div class="access-wallet-layout-container">
    <introduction />
    <select-wallet-container />
    </div>
  </div>
</template>

<script>
import SelectWalletContainer from '@/containers/SelectWalletContainer.vue';
import Introduction from '@/components/Introduction.vue';
import Popup from '@/components/Popup.vue';

export default {
  components: {
    'introduction': Introduction,
    'select-wallet-container': SelectWalletContainer,
    'popup': Popup,
  },
};
</script>

<style scoped>
.access-wallet-layout {
  display: flex;
  padding-top: 35px;
  flex-direction: column;
}
.access-wallet-layout-container {
  display: flex;
}
</style>
