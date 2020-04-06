
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
      if (this.signIn && this.$route.path !== '/dashboard') {
        this.$router.push('/dashboard');
      } else if(!this.signIn && this.$route.path !== '/') {
        this.$router.replace('/');
      }
    },
  },
};
