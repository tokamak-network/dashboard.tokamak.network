<template>
  <div class="main-layout">
    <menu-container />
    <div class="main-container">
      <wallet-info-container />
      <router-view />
      <send-transaction-modal
        v-if="isModalShowed"
        @modalClosed="closeModal"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import WalletInfoContainer from '@/containers/WalletInfoContainer.vue';
import MenuContainer from '@/containers/MenuContainer.vue';
import SendTransactionModal from '@/containers/modal/SendTransactionModal.vue';

export default {
  components: {
    'menu-container': MenuContainer,
    'wallet-info-container': WalletInfoContainer,
    'send-transaction-modal': SendTransactionModal,
  },
  computed: mapState([
    'isModalShowed',
  ]),
  methods: {
    closeModal () {
      this.$store.dispatch('closeModal');
    },
  },
};
</script>

<style>
.main-layout {
  width: 100%;
  height: 100%;
  padding-top: 16px;
  display: flex;
  padding-bottom: 6rem;
}

.main-container {
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  position: relative;
}
</style>
