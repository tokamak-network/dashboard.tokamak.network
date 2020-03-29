<template>
  <div class="operator-info-container">
    <div class="row name-container">
      <div class="name">{{ operator.name }}</div>
      <avatar class="avatar" fullname="O P R" :image="filteredImgURL(operator.avatar)" :size="50" :color="operator.color" />
      <div class="space" style="flex: 1;" />
      <div v-if="user === operator.address" class="button"><base-button :label="'edit'" :func="edit" /></div>
    </div>
    <text-viewer :title="'Website'" :content="operator.website" :with-divider="true" />
    <text-viewer :title="'Description'" :content="operator.description" :with-divider="true" />
    <text-viewer :title="'Address'" :content="operator.address" :with-divider="true" />
    <text-viewer :title="'RootChain'" :content="operator.rootchain" :with-divider="true" />
    <text-viewer :title="'Recent Commit Timestamp'" :content="operator.recentCommitTimestamp" :with-divider="true" />
    <text-viewer :title="'Commit Count'" :content="operator.commitCount" :with-divider="true" />
    <text-viewer :title="'Duration'" :content="operator.duration" :with-divider="true" />
    <text-viewer :title="'Reward'" :content="operator.userReward" :with-divider="true" />
    <text-viewer :title="'Total Staked'" :content="operator.totalStaked" :with-divider="true" />
    <text-viewer :title="'Staked'" :content="operator.userStaked" :with-divider="true" />
    <text-viewer :title="'Not Withdrawable'" :content="operator.userNotWithdrawable" :with-divider="true" />
    <text-viewer :title="'Withdrawable'" :content="operator.userWithdrawable" :with-divider="true" />
  </div>
</template>

<script>
import config from '../../config.json';

import { mapState } from 'vuex';
import Avatar from 'vue-avatar-component';
import TextViewer from '@/components/TextViewer.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  components: {
    'avatar': Avatar,
    'text-viewer': TextViewer,
    'base-button': BaseButton,
  },
  props: {
    operator: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState([
      'user',
    ]),
    filteredImgURL () {
      return name => name !== '' ? `${config.baseURL}/avatars/${name}` : '';
    },
  },
  methods: {
    edit () {
      const path = this.$route.path;
      this.$router.push(`${path}/edit`);
    },
  },
};
</script>

<style scoped>
.operator-info-container {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}

.name-container {
  padding-top: 12px;
  padding-bottom: 12px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.name {
  padding-left: 16px;
  padding-right: 8px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.button {
  color: #ffffff;
  background-color: #35496b;
  border: 1px solid #35496b;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  height: 22px;
  width: 40px;
  margin-right: 16px;
}
</style>
