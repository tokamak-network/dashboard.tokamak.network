<template>
  <div class="expected-reward-container ">
    <container-header :title="'Expected Reward'" />
    <text-viewer :title="'Total Expected Reward Amount'" :content="currencyAmount(userTotalSeigs)" :with-divider="true" />
    <text-viewer :title="'Average Expected Reward Rate'" :content="userSeigsRate(userTotalStaked, userTotalSeigs)" :with-divider="false" />
    <text-viewer :title="'Staked Operators'" :content="operatorsStaked.length" :with-divider="false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TextViewer from '@/components/TextViewer.vue';
import ContainerHeader from '@/containers/ContainerHeader.vue';

export default {
  components: {
    'text-viewer': TextViewer,
    'container-header': ContainerHeader,
  },
  computed: {
    ...mapGetters([
      'operatorsStaked',
      'userTotalStaked',
      'userTotalSeigs',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    userSeigsRate () {
      return (userStaked, userSeigs) => this.$options.filters.userSeigsRate(userStaked, userSeigs);
    },
  },
};
</script>

<style scoped>
.expected-reward-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-right: 4px;
}
</style>
