
import { mapGetters } from 'vuex';
import StakeInfoContainer from '@/containers/StakeInfoContainer.js';
import StakedOperatorContainer from '@/containers/StakedOperatorContainer.js';

export default {
  components: {
    'stake-info-container': StakeInfoContainer,
    'staked-operator-container': StakedOperatorContainer,
  },
  data () {
    return {
      columns: [],
      searching: false,
      operatorsBySearching: [],
    };
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
    ]),
  },
  created () {
    this.columns = [
      {
        name: 'OPERATOR',
        key: 'name',
      },
      {
        name: 'MY STAKE',
        key: 'userStaked',
      },
    ];
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
    searchOperatorByName (name) {
      if (name === '') {
        this.searching = false;
      } else {
        this.searching = true;
        this.operatorsByName =
          this.operators.filter(operator => operator.name.toLowerCase().includes(name.toLowerCase()));
      }
    },
  },
};
