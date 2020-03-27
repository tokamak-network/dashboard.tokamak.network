<template>
  <div class="operator-info-container">
    <div class="row" style="align-items: center;">
      <avatar class="avatar" fullname="O P R" :image="filteredImgURL(operator.avatar)" :size="100" :color="operator.color" />
      <h4 style="flex: 1;" align="right">{{ operator.name }}</h4>
    </div>
    <text-viewer style="margin-top: 16px;" :title="'Website'" :content="operator.website" />
    <text-viewer :title="'Description'" :content="operator.description" />
    <text-viewer style="margin-top: 24px;" :title="'Address'" :content="operator.address" />
    <text-viewer :title="'RootChain'" :content="operator.rootchain" />
    <text-viewer style="margin-top: 24px;" :title="'Recent Commit Timestamp'" :content="operator.recentCommitTimestamp" />
    <text-viewer :title="'Commit Count'" :content="operator.commitCount" />
    <text-viewer :title="'Duration'" :content="operator.duration" />
    <text-viewer :title="'Total Staked'" :content="operator.totalStaked" />
    <text-viewer style="margin-top: 24px;" :title="'Reward'" :content="operator.userReward" />
    <text-viewer :title="'Staked'" :content="operator.userStaked" />
    <text-viewer :title="'Not Withdrawable'" :content="operator.userNotWithdrawable" />
    <text-viewer :title="'Withdrawable'" :content="operator.userWithdrawable" />
  </div>
</template>

<script>
import config from '../../config.json';

import { mapState, mapGetters } from 'vuex';
import OperatorInfoRegistry from '@/components/OperatorInfoRegistry.vue';
import Avatar from 'vue-avatar-component';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'avatar': Avatar,
    'text-viewer': TextViewer,
  },
  props: {
    operator: {
      required: true,
      type: Object,
    },
  },
  computed: {
    filteredImgURL () {
      return name => {
        if (name === '') {
          return name;
        }
        return `${config.baseURL}/avatars/${name}`;
      };
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}

h4 {
  padding: 0px;
  margin: 0px;
}
</style>
