
import { mapState } from 'vuex';

export default {
  props: {
    image: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    connect: {
      type: Function,
      default: () => {},
    },
  },
  data () {
    return {
      loading: false,
    };
  },
  computed: mapState([
    'web3',
  ]),
  methods: {
    async connectWallet () {
      if (this.loading) return;

      this.loading = true;
      await this.connect();
      this.loading = false;
    },
  },
};
