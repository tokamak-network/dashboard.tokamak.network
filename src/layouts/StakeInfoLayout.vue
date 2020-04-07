<template>
  <div class="stake-info-layout">
    <stake-info-container style="flex: 1; margin-right: 4px;" />
    <staked-operator-container style="flex: 1; margin-left: 4px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import StakeInfoContainer from '@/containers/StakeInfoContainer.vue';
import StakedOperatorContainer from '@/containers/StakedOperatorContainer.vue';

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
      this.$router.push(`/operators/${rootchain.toLowerCase()}`).catch(err => {});
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
</script>

<style scoped>
.stake-info-layout {
  display: flex;
  flex-direction: row;
}
</style>
