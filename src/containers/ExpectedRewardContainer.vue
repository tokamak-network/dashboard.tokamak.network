<template>
  <div class="expected-reward-container ">
    <container-header :title="'Expected Reward'" />
    <text-viewer :title="'Total Expected Reward Amount'"
                 :content="currencyAmount(userTotalSeigs)"
                 :with-divider="true"
                 :tooltip="'You can get this reward as soon as operator commit, but it does not reflected to Total Reward.'"
                 :tooltipWidth="'220px'"
                 :tooltipMarginTop="'-26px'"
    />
    <text-viewer :title="'Total Expected Reward Rate'"
                 :content="userSeigsRate(userTotalStaked, userTotalSeigs)"
                 :with-divider="false"
                 :tooltip="'Total Expected Reward Amount / Total delegate-stake * 100'"
                 :tooltipWidth="'220px'"
                 :tooltipMarginTop="'-17px'"
    />
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
  min-height: 100%;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  margin-right: 4px;
}
</style>
