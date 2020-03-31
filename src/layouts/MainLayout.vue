<template>
  <div class="main-layout">
    <menu-container />
    <div class="main-container">
      <wallet-info-container />
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WalletInfoContainer from '@/containers/WalletInfoContainer.vue';
import MenuContainer from '@/containers/MenuContainer.vue';

export default {
  components: {
    'menu-container': MenuContainer,
    'wallet-info-container': WalletInfoContainer,
  },
  data () {
    return {
      depositedEventSubscription: null,
      polling: null,
    };
  },
  computed: {
    ...mapState([
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
          this.$store.dispatch('set');
        }
      }, 5000); // 5s
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
  width: 100%;
  padding-top: 16px;
  padding-bottom: 2rem;
}

.main-container {
  padding-left: 16px;
  width: 100%;
  position: relative;
}
</style>
