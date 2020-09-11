<template>
  <div class="main-layout">
    <!-- <popup /> -->
    <div class="main-container">
      <menu-container />
      <div class="main-body-container">
        <notifications group="reverted" style="width: 30%" />
        <notifications group="confirmed" style="width: 30%" />

        <wallet-info-container />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WalletInfoContainer from '@/containers/WalletInfoContainer.vue';
import MenuContainer from '@/containers/MenuContainer.vue';
// import Popup from '@/components/Popup.vue';

export default {
  components: {
    'menu-container': MenuContainer,
    'wallet-info-container': WalletInfoContainer,
    //  'popup': Popup,
  },
  data () {
    return {
      depositedEventSubscription: null,
      polling: null,
    };
  },
  computed: {
    ...mapState([
      'web3',
      'DepositManager',
    ]),
  },
  async created () {
    this.poll();
    this.subscribe();
  },
  beforeDestroy () {
    clearInterval(this.polling);
    this.depositedEventSubscription.unsubscribe();
  },
  methods: {
    poll () {
      this.polling = setInterval(() => {
        if (this.$store.state.signIn) {
          this.$store.dispatch('set', this.web3);
        }
      }, 13000); // 13s
    },
    subscribe () {
      this.depositedEventSubscription = this.DepositManager.events.Deposited({
        fromBlock: 'latest',
      }, (error, event) => {
        if (error) {
          //
        }
        const result = event.returnValues;
        this.$store.dispatch('addAccountDepositedWithPower', result.depositor);
      });
    },
  },
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-width: 1080px;
  max-width: 1080px;
  padding-top: 16px;
  padding-bottom: 2rem;
  flex-direction: column;
}
.main-container {
  display: flex;
  flex-direction: row;
}
.main-body-container {
  padding-left: 16px;
  width: 100%;
  position: relative;
}
</style>
