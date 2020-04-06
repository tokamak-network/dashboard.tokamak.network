
import { mapState, mapGetters } from 'vuex';

import LoadingSpinner from '@/components/LoadingSpinner.js';
import TxProcessor from '@/components/TxProcessor.js';
import HeaderContainer from '@/containers/HeaderContainer.js';
import FooterContainer from '@/containers/FooterContainer.js';
import AccessWalletLayout from '@/layouts/AccessWalletLayout.js';
import MainLayout from '@/layouts/MainLayout.js';
import AccessWalletLayoutVue from '@/layouts/AccessWalletLayout.js';
import NetworkGuideLayout from '@/layouts/NetworkGuideLayout.js';

export default {
  components: {
    'loading-spinner': LoadingSpinner,
    'header-container': HeaderContainer,
    'footer-container': FooterContainer,
    'access-wallet-layout': AccessWalletLayout,
    'main-layout': MainLayout,
    'tx-processor': TxProcessor,
  },
  data () {
    return {
      message: '',
    };
  },
  computed: {
    ...mapState([
      'loading',
      'signIn',
    ]),
    ...mapGetters([
      'initialState',
    ]),
  },
  created () {
    if (this.initialState && this.$route.path !== '/') {
      this.$router.replace('/');
    }
    this.$store.watch(
      (_, getters) => getters.initialState,
      (logout) => {
        if (logout && this.$route.path !== '/') {
          this.$router.replace('/');
        }
      },
    );
  },
};
