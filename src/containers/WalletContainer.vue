<template>
  <div class="wallet-container">
    <div class="title">My Account</div>
    <div class="ton-title">#10</div>
    <div class="ton-value">{{ user }}</div>
    <div class="ton-title">#11</div>
    <div
      v-clipboard:copy="user"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    >
      Copy
    </div>
    <div class="ton-title">#12</div>
    <a class="text" target="_blank"
       rel="noopener noreferrer"
       :href="'https://etherscan.io/address/' + user"
    >View on Etherscan</a>
    <div class="ton-title">#9</div>
    <div class="ton-title">#13</div>
    <div class="" @click="logout">
      Logout
    </div>
    <div @click="cancel(false)">
      Close
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getConfig } from '../../config.js';
import { mapState, mapGetters } from 'vuex';

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

export default {
  computed: {
    ...mapState([
      'tonBalance',
      'user',
      'power',
      'signIn',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  methods: {
    async logout (visibility) {
      const provider = new WalletConnectProvider({
        infuraId: '34448178b25e4fbda6d80f4da62afba2',
        // bridge: 'https://bridge.walletconnect.org',
        qrcode: true,
      });
      this.$store.dispatch('SIGN_OUT');
      await provider.disconnect();
      this.cancel(visibility);
      this.$store.dispatch('logout');
      this.$router.replace({
        path: '/',
        query: { network: this.$route.query.network },
      }).catch(err => {
      });
    },
    cancel (visibility) {
      this.$emit('showPopUp', visibility);
    },
    onCopy: function (e) {
      alert('You just copied: ' + e.text);
    },
    onError: function (e) {
      alert('Failed to copy texts');
    },
  },
};
</script>

<style scoped>
.wallet-container {
    background-color:#f6f8f9;
    width: 500px;
    height: 550px;
    display: flex;
    border-radius: 12px;
    align-items: center;
    flex-direction: column;
}
.title {
    align-items: center;
    color: #555555;
    display: flex;
    font-size: 18px;
    font-weight: 700;
    height: 72px;
}

.logo {
    height: 80px;
    width: 115px;
    margin: 12px auto 16px;
}
.ton-value {
    font-family: "Noto Sans",sans-serif;
    font-size: 36px;
    font-weight: 700;
     color: #555555;
}
.power-value {
  font-family: "Noto Sans",sans-serif;
    font-size: 16px;
    font-weight: 700;
     color: #555555;
}
.ton-title {
    font-size: 16px;
     color: #555555;
     opacity: 0.8;
}
.wallet-button {
    display: flex;
    width: 90%;
     background-color:#f6f8f9;
  border-radius: 12px;
  box-shadow:  #e2e8eb 6px 6px 12px,#e2e8eb -12px -12px 24px -2px;
  margin-top: 20px;
  opacity: 0.8;
  height: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.wallet-button:hover {
    opacity: 1;
}
.text {
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
    color: #555555;
    opacity: 0.8;
    display: flex;
}
button {
    border: none;
    background-color:#f6f8f9;
}
button:focus {
    outline: none;
    background-color:#f6f8f9;
}
</style>
