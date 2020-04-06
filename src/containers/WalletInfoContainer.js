
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState([
      'user',
      'networkId',
      'tonBalance',
      'blockNumber',
    ]),
    ...mapGetters([
      'userTotalStaked',
    ]),
  },
};
