<template>
  <div class="column">
    <div class="row avatar-container">
      <avatar class="avatar" fullname="O P R" :image="preview" :size="50" />
      <div v-if="user === operator.address" class="button"><base-button :label="'edit'" :func="edit" /></div>
    </div>
    <div class="row">
      <span class="title">NAME</span>
      <div class="content-container"><span class="content">{{ operator.registry.name }}</span></div>
    </div>
    <div class="row">
      <span class="title">WEBSITE</span>
      <div class="content-container"><span class="content">{{ operator.registry.website }}</span></div>
    </div>
    <div class="row">
      <span class="title">DESCRIPTION</span>
      <div class="content-container"><span class="content">{{ operator.registry.description }}</span></div>
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
      return name => `http://${window.location.hostname}:9000/avatars/${name}`;
    },
  },
  created () {
    if (this.operator.registry.avatar !== '') {
      this.preview = this.filteredImgURL(this.operator.registry.avatar);
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
  margin-right: 240px;
}

.avatar-container {
  margin: 16px;
}

.content-container {
  flex: 1;
  margin-right: 16px;
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
}
</style>
