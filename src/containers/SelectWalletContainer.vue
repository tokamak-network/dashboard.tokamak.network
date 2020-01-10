<template>
  <div class="select-wallet-container">
    <div class="wallet-header-container">
      <img
        src="@/assets/images/Wallet.svg"
        width="32.5"
        height="32.5"
      >
      <div class="wallet-header-title">
        Sellect Wallet
      </div>
    </div>
    <div
      v-for="(wallet, index) in wallets"
      :key="index"
      class="wallet-container"
      @click="accessWallet(wallet)"
    >
      <img
        class="wallet-image"
        src="@/assets/images/Metamask.jpg"
        width="25"
        height="23"
      >
      <div class="wallet-title">
        {{ wallet }}
      </div>
    </div>
  </div>
</template>

<script>
import mm from '@/helpers/wallets/metamask';

export default {
  data () {
    return {
      wallets: ['Metamask', 2, 3],
    };
  },
  methods: {
    async accessWallet (wallet) {
      switch (wallet) {
      case 'Metamask': {
        const walletInfo = await mm.accessMetamaskWallet();
        if (walletInfo.isConnected) {
          this.$store.dispatch('setWalletInfo', walletInfo);
        }
        return;
      }

      default:
        break;
      }
    },
  },
};
</script>

<style>
.select-wallet-container {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 390px;
  padding-top: 30px;
  padding-bottom: 30px;
  border-radius: 6px;
}

.wallet-header-container {
  display: flex;
  align-items: center;
  height: 36px;
  padding-bottom: 11px;
}

.wallet-container {
  display: flex;
  align-items: center;
  width: 317px;
  height: 46px;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  margin-top: 16px;
}

.wallet-image {
  padding-left: 19px;
  padding-right: 23px;
}

.wallet-header-title {
  padding-top: 5px;
  font-size: 24px;
  color: #124b71;
  padding-left: 9.2px;
}

.wallet-title {
  padding-top: 4px;
  font-size: 16px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #5c5c5c;
}
</style>
