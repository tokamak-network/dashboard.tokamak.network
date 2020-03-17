<template>
  <div class="column">
    <div class="row avatar-container">
      <avatar class="avatar" fullname="O P R" :image="preview" :size="50" />
      <div v-if="user === operator.address" class="button"><base-button :label="'edit'" :func="edit" /></div>
    </div>
    <div class="row">
      <span class="title">NAME</span>
      <div class="content-container"><span class="content">{{ operator.name }}</span></div>
    </div>
    <div class="row">
      <span class="title">WEBSITE</span>
      <div class="content-container"><span class="content">{{ operator.website }}</span></div>
    </div>
    <div class="row">
      <span class="title">DESCRIPTION</span>
      <div class="content-container"><span class="content">{{ operator.description }}</span></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Avatar from 'vue-avatar-component';
import BaseButton from '@/components/BaseButton.vue';

export default {
  components: {
    'base-button': BaseButton,
    'avatar': Avatar,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      preview: '',
    };
  },
  computed: {
    ...mapState([
      'user',
    ]),
    filteredImgURL () {
      return name => `http://127.0.0.1:9000/avatars/${name}`;
    },
  },
  created () {
    if (this.operator.avatar !== '') {
      this.preview = this.filteredImgURL(this.operator.avatar);
    }
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
.column {
  display: flex;
  flex-direction: column;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.title {
  width: 100px;
  margin-left: 16px;
}

.avatar {
  margin-left: 4px;
  margin-right: 16px;
}

.avatar-container {
  margin: 8px;
  align-items: center;
}

.content-container {
  flex: 1;
  margin-right: 8px;
}

.content {
  float: right;
  word-break: break-all;
}

.button {
  color: #ffffff;
  background-color: #6fc4b3;
  border: 1px solid #6fc4b3;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  height: 20px;
  width: 40px;
}
</style>
