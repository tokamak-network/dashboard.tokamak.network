<template>
  <div class="wallet-container">
    <div class="title">My Account</div>
    <img class="logo" style="margin-right: 15px; margin-left: 0px;" src="@/assets/images/TokamakLogo.png">
   <div class="ton-title">TON Balance</div>
    <div class="ton-value">{{ tonBalance | currencyAmount }}</div>
    <div class="ton-title">Power Balance</div>
    <div class="power-value">{{ power | currencyAmount }}</div>
    <div class="wallet-button">
      <a class="text" target="_blank"
         rel="noopener noreferrer"
         :href="'https://etherscan.io/address/' + user"
      >View on Etherscan</a>
    </div>
    <div class="wallet-button" @click="logout">
      <button class="text">Sign Out</button>
    </div>
    <div class="wallet-button" @click="cancel(false)">
      <button class="text">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapState([
      'tonBalance',
      'user',
      'power',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  methods: {
    logout (visibility) {
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
