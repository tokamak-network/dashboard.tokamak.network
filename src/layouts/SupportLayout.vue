<template>
  <div class="support-layout">
    <div ref="top" class="support-title-container">
      <h1>Support</h1>
      <h2>We will guide you on how to stake TON in Tokamak Network</h2>
    </div>
    <div class="button-container">
      <button class="support-button" @click="scrollMeTo('introduction')">
        Introduction to Staking
      </button>
      <!-- <button @click="scrollMeTo('install')" class="support-button">Metamask</button> -->
      <button class="support-button" @click="scrollMeTo('install')">
        Install Metamask
      </button>
      <button class="support-button" @click="scrollMeTo('login')">Login</button>
      <button class="support-button" @click="scrollMeTo('stake')">Stake</button>
      <button class="support-button" @click="scrollMeTo('unstake')">
        Un-stake
      </button>
      <button class="support-button" @click="scrollMeTo('restake')">
        Re-stake
      </button>
      <button class="support-button" @click="scrollMeTo('withdraw')">
        Withdraw
      </button>
      <button class="support-button" @click="scrollMeTo('powerton')">
        PowerTON
      </button>
      <button class="support-button" @click="scrollMeTo('wallet')">
        Wallet
      </button>
    </div>
    <div class="tokamak-logo">
      <img class="logo" src="@/assets/images/tokamak-staking-simple.png">
    </div>
    <div class="instructions-container">
      <div ref="introduction">
        <SupportIntroduction />
      </div>
      <div ref="install">
        <SupportInstallMetamask />
      </div>
      <div ref="login">
        <SupportLogin />
      </div>
      <div ref="stake">
        <SupportStake />
      </div>
      <div ref="unstake">
        <SupportUnstake />
      </div>
      <div ref="restake">
        <SupportRestake />
      </div>
      <div ref="withdraw">
        <div class="title">Withdraw</div>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
      </div>
      <div ref="powerton">
        <div class="title">PowerTON</div>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
        Etiam eleifend dapibus sapien, nec accumsan mauris sagittis sed. Quisque
        ut egestas mauris. Cras fringilla risus quis dolor tempus volutpat. Ut
        ac maximus metus. Aliquam erat volutpat. Pellentesque iaculis erat eu
        leo aliquam maximus. Duis sed arcu varius, cursus nibh id, tincidunt
        urna. Mauris erat metus, ornare sit amet sagittis in, rutrum in augue.
        Vivamus pretium vitae nibh eget rhoncus. Ut eget felis urna. Integer
      </div>
      <div ref="wallet">
        <support-wallet />
      </div>
    </div>
    <div>
      <img class="top-button" src="@/assets/images/top_arrow_icon.png" @click="scrollMeTo('top')">
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import SupportIntroduction from '../components/support/SupportIntroduction.vue';
import SupportInstallMetamask from '../components/support/SupportInstallMetamask.vue';
import SupportLogin from '../components/support/SupportLogin';
import SupportStake from '../components/support/SupportStake.vue';
import SupportUnstake from '../components/support/SupportUnstake.vue';
import SupportRestake from '../components/support/SupportRestake.vue';
import SupportWallet from '@/components/support/SupportWallet.vue';
export default {
  components: {
    SupportIntroduction,
    SupportInstallMetamask,
    SupportLogin,
    SupportStake,
    SupportUnstake,
    SupportRestake,
    SupportWallet,
  },
  methods: {
    scrollMeTo (refName) {
      const element = this.$refs[refName];
      const top = element.offsetTop;

      window.scrollTo(0, top);
    },
  },
};
</script>
<style scoped>
.support-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 70px;
}
.support-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.support-title-container h1 {
  font-family: "NanumSquare", sans-serif;
  font-size: 38px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  margin-bottom: 15px;
}
.support-title-container h2 {
  font-family: "Titillium Web", sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.4px;
  text-align: center;
  color: #808992;
  margin-bottom: 60px;
}
.button-container {
  width: 69.6%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.support-button {
  width: 200px;
  height: 42px;
  margin: 10px 15px;
  padding: 12px 30px;
  border: none;
  border-radius: 24px;
  box-shadow: 0 1px 3px 0 rgba(96, 97, 112, 0.16);
  background-color: #fafbfc;
  text-align: center;
  font-family: Roboto;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: center;
  color: #3d495d;
}
.support-button:focus {
  background-color: #2a72e5;
  color: #ffffff;
}
.tokamak-logo {
  width: 1114px;
  height: 450px;
  background-color: #ffffff;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
   box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);

}
.logo {
  width: 730px;
  height: 90px;
}
.instructions-container {
  width: 1114px;
}
.top-button {
  position: fixed;
  bottom: 90px;
  right: 50px;
}
.top-button:hover {
  cursor: pointer;
}
</style>
