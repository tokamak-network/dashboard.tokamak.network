<template>
  <div class="access-wallet-layout">
    <div style="width: 100%;">
      <img
        class="into-image"
        src="@/assets/images/Intro.png"
      >
      <div class="intro-title">
        Turing Complete
      </div>
      <div class="intro-title">
        Plasma Chain Building Protocol
      </div>
      <div class="intro-content">
        Tokamak Network is a platform that assures decentralized and secure
        property same as Ethereum Main chain while supporting high level of
        scalability and extendability. Each Dapp is built easily for specific purpose
        through Tokamak Network.
      </div>
    </div>
    <div class="intro-content" />
    <select-wallet-container style="padding-left: 64px;" />
  </div>
</template>

<script>
import SelectWalletContainer from '@/containers/SelectWalletContainer.vue';
import mm from '@/helpers/wallets/metamask';

export default {
  components: {
    'select-wallet-container': SelectWalletContainer,
  },
};
</script>

<style>
.access-wallet-layout {
  height: 100%;
  padding-top: 85px;
  display: flex;
}

.into-image {
  margin-bottom: 20px;
}

.intro-title {
  font-size: 24px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #176ea8;
}

.intro-content {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.63;
  letter-spacing: normal;
  text-align: left;
  color: #6d848e;
  word-break: break-all;
}
</style>
