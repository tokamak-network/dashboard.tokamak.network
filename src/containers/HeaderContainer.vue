<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          class="header-logo"
          src="@/assets/images/Tokamak.png"
          width="230"
          height="29"
          @click="toMainPage"
        >
      </div>
      <div class="header-link-container">
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          :href="faucet"
        >FAUCET</a>
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          :href="FAQs"
        >FAQs</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      FAQs: '',
      faucet: '',
    };
  },
  computed: {
    ...mapState([
      'signIn',
    ]),
  },
  created () {
    this.FAQs = process.env.VUE_APP_FAQS_LINK;
    this.faucet = process.env.VUE_APP_FAUCET_LINK;
  },
  methods: {
    toMainPage () {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 60px;
  background: #20232a;
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
  width: 160px;
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
