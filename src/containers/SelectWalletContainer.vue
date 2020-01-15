<template>
  <div class="select-wallet-container">
    <div class="wallet-header-container">
      <div class="wallet-header-title">
        Sellect Wallet
      </div>
    </div>
    <div
      class="wallet-container"
      @click="accessWallet('Metamask')"
    >
      <img
        class="wallet-image"
        src="@/assets/images/Metamask.jpg"
        width="25"
        height="23"
      >
      <div class="wallet-title">
        MetaMask
      </div>
    </div>
    <div
      class="wallet-container"
      @click="accessWallet('LedgerNano')"
    >
      <img
        class="wallet-image"
        src="@/assets/images/LedgerNano.jpeg"
        width="25"
        height="23"
      >
      <div class="wallet-title">
        Ledger Nano (준비중)
      </div>
    </div>
    <div
      class="wallet-container"
      @click="accessWallet('Trezor')"
    >
      <img
        class="wallet-image"
        src="@/assets/images/Trezor.png"
        width="25"
        height="25"
      >
      <div class="wallet-title">
        Trezor (준비중)
      </div>
    </div>
    <div
      class="wallet-container"
      @click="accessWallet('CoinbaseWallet')"
    >
      <img
        class="wallet-image"
        src="@/assets/images/CoinbaseWallet.jpeg"
        width="25"
        height="25"
      >
      <div class="wallet-title">
        Coinbase Wallet (준비중)
      </div>
    </div>
  </div>
</template>

<script>
import mm from '@/helpers/wallets/metamask';

export default {
  methods: {
    async accessWallet (wallet) {
      switch (wallet) {
      case 'Metamask': {
        const walletInfo = await mm.accessMetamaskWallet();
        if (walletInfo.isConnected) {
          this.$store.dispatch('setWalletInfo', walletInfo);
          this.$router.replace('/dashboard');
        } else {
          alert('MetaMask(메타마스크) 지갑 설치 후 이용가능합니다.');
        }
        return;
      }

      default:
        alert('해당 지갑은 준비중에 있습니다.');
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
  width: 320px;
  display: flex;
  align-items: center;
  height: 36px;
}

.wallet-container {
  display: flex;
  align-items: center;
  width: 320px;
  height: 54px;
  border-radius: 3px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.06);
  background-color: #ffffff;
  margin-top: 9px;
  border: solid 0.7px #ffffff;
}

.wallet-container:hover {
  cursor: pointer;
  background-color: #f7f8f9;
  border-radius: 3px;
  border: solid 0.7px #ced6d9;
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
