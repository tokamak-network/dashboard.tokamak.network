
import { mapState } from 'vuex';
import WalletInfoContainer from '@/containers/WalletInfoContainer.js';
import MenuContainer from '@/containers/MenuContainer.js';

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
