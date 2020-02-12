<template>
  <div class="access-wallet-layout">
    <introduction />
    <select-wallet-container />
  </div>
</template>

<script>
import SelectWalletContainer from '@/containers/SelectWalletContainer.vue';
import Introduction from '@/components/Introduction.vue';

export default {
  components: {
    'introduction': Introduction,
    'select-wallet-container': SelectWalletContainer,
  },
  created () {
    this.$store.dispatch('logout');
  },
};
</script>

<style scoped>
.access-wallet-layout {
  display: flex;
  flex-direction: row;
  padding-top: 85px;
}
</style>
