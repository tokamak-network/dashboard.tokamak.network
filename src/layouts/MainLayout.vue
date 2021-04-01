<template>
  <div class="main-layout">
    <div class="main-container">
      <div class="main-body-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {
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
      'loaded',
    ]),
  },
  async created () {
    this.poll();
    // this.subscribe();
  },
  deactivated () {
    clearInterval(this.polling);
    this.depositedEventSubscription.unsubscribe();
  },
  methods: {
    poll () {
      this.polling = setInterval(() => {
        if (!this.$store.state.loading) {
          // this.$store.dispatch('set', this.web3);
        }
      }, 13000); // 13s
    },
    subscribe () {
      if (this.loaded){
        this.depositedEventSubscription = this.DepositManager.events.Deposited({
          fromBlock: 'latest',
        }, (error, event) => {
          if (error) {
          //
          }
          const result = event.returnValues;
          this.$store.dispatch('addAccountDepositedWithPower', result.depositor);
        });
      }
    },
  },
};
</script>

<style scoped>
.main-layout {
   display: flex;
  padding-bottom: 2rem;
  flex-direction: column;
  background-color: #fafbfc;
  align-items: center;
}
.main-container {
  display: flex;
  flex-direction: row;
}
.main-body-container {
  background-color: #fafbfc;
    align-items: center;
}
</style>
