<template>
  <div class="support-layout">
    <div class="support-title-container">
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
        <div class="title">Introduction to staking</div>
        <h3 class="subtitle">What is staking?</h3>
        <p class="description">
          The word staking comes from the word stake. Stake means to support, or
          to secure something, such as a tent. In the blockchain space, staking
          means to deposit tokens to support the network by verifying
          transactions and sustaining its stability.
        </p>
        <p class="description">
          The background for the creation of staking in blockchain is related to
          how blocks are verified. Originally Proof of Work was to secure and
          verify the network, but it was inefficient as it wastes a large amount
          of electricity. Proof of Stake came about as an alternative to Proof
          of Work.
        </p>
        <p class="description">
          As a part of DeFi, staking has become a popular financial instrument,
          but in reality it was created for the security of blockchain networks
          and to incentivize those participating in the operation of the
          network. Participants stake tokens as deposits, and the network
          provides them with interest as a reward for offering this service.
          Staking with Tokamak Network is imilar but different.
        </p>
        <p class="description">
          Typical Staking based blockchains have one chain with various
          operators and thus the trust of operators wasn’t a significant factor.
          But for Tokamak Networks Layer 2 chains, anyone can open and run a
          plasma and roll-up chain. Because of this, the chain economy must be
          structured that anyone can trust the operator and the data of the L2
          chain. The Tokamak Network staking system allows for the creation of
          this credibility.
        </p>
        <img class="screenshot" src="@/assets/images/screenshot_home.png">
        <h3 class="subtitle">Main Composition of Tokamak Network Simple Staking</h3>
        <p class="description" />
      </div>
      <div ref="install">
        <div class="title">Install Metamask</div>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at

        eu.
      </div>
      <div ref="login">
        <div class="title">Login</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        eu.
      </div>
      <div ref="stake">
        <div>Stake</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
        Etiam eleifend dapibus sapien, nec accumsan mauris sagittis sed. Quisque
        ut egestas mauris. Cras fringilla risus quis dolor tempus volutpat. Ut
      </div>
      <div ref="unstake">
        <div class="title">Unstake</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
      </div>
      <div ref="restake">
        <div class="title">Restake</div>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
        Etiam eleifend dapibus sapien, nec accumsan mauris sagittis sed. Quisque
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
        <div class="title">Wallet</div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
        fermentum fermentum nisl sed volutpat. Praesent a interdum eros. Nam at
        lectus lectus. Suspendisse vitae justo diam. Etiam vitae bibendum felis.
        Sed nec elit nibh. Vestibulum hendrerit lorem sed tellus ullamcorper, at
        consequat dui rhoncus. Fusce id posuere dui. Nullam eu tincidunt eros.
        Etiam eleifend dapibus sapien, nec accumsan mauris sagittis sed. Quisque
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

export default {
  components: {},
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
  font-weight: 500;
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
}
.logo {
  width: 730px;
  height: 76px;
}
.instructions-container {
  width: 1114px;
}
.title {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.2px;
  text-align: left;
  color: #2a72e5;
  margin-bottom: 20px;
}
.subtitle {
  font-family: Roboto;
  font-size: 17px;
  font-weight: 700;
  color: #3d495d;
}
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
.screenshot {
  width: 100%;
  height: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
}
</style>
