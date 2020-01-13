<template>
  <div class="select-wallet-container">
    <div class="wallet-header-container">
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wallet-header-container {
  width: 360px;
  display: flex;
  align-items: center;
  height: 36px;
}

.wallet-container {
  display: flex;
  align-items: center;
  width: 360px;
  height: 54px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  margin-top: 9px;
}

.wallet-container:hover {
  cursor: pointer;
}

.wallet-image {
  padding-left: 19px;
  padding-right: 23px;
}

.wallet-header-title {
  font-family: OpenSans;
  font-size: 21px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
  color: #b2b7b9;
}

.wallet-title {
  padding-top: 4px;
  object-fit: contain;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #5c5c5c;
}
</style>
