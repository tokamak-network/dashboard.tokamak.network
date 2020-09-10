<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          class="header-logo"
          src="@/assets/images/tokamak-staking.png"
          width="250"
          height="40"
          @click="toMainPage"
        >
      </div>
      <div class="header-link-container">
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://tokamak.network"
        >What is TON?</a>
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.google.com/presentation/d/154nxPwhyzCwFKgWWQKUV2upFk-Wpi4Vp0sOXTKD0h0A/edit#slide=id.g9722e47687_2_0"
          style="margin-left: 48px;"
        >Staking User Guide</a>
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="https://staking-simulator.tokamak.network"
          style="margin-left: 48px; margin-right: 36px;"
        >Staking Simulator</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import GuideDropDown from '@/components/GuideDropDown.vue';

export default {
  components: {
    // 'guide-drop-down': GuideDropDown,
  },
  computed: {
    ...mapState([
      'signIn',
    ]),
  },
  methods: {
    toMainPage () {
      if (this.signIn && this.$route.path !== '/dashboard') {
        this.$router.push({
          path: '/dashboard',
          query: { network: this.$route.query.network },
        }).catch(err => {});
      } else if(!this.signIn && this.$route.path !== '/') {
        this.$router.push({
          path: '/',
          query: { network: this.$route.query.network },
        }).catch(err => {});
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.header {
  width: 960px;
  height: 100%;
  align-items: center;
  display: flex;
}

.header-logo-container {
  flex: 1;
}

.header-logo {
  margin-top: 7px;
  padding-left: 16px;
}

.header-logo:hover {
  cursor: pointer;
}

.header-link-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-link:hover {
  color: #141414b0;
}

.header-link {
  text-decoration: none;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #7e8d93;
}
</style>
