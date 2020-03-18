<template>
  <div class="column">
    <avatar fullname="O P R" :color="randomColor" :image="preview" :size="96" />
    <label class="custom-file-upload"><input type="file" accept="image/*" @change="onSelect">Upload</label>
  </div>
</template>

<script>
import config from '../../config.json';

import Avatar from 'vue-avatar-component';

export default {
  components: {
    'avatar': Avatar,
  },
  props: {
    avatar: {},
    beforeAvatar: {},
  },
  data () {
    return {
      selectedFile: null,
      preview: '',
    };
  },
  computed: {
    filteredImgURL () {
      return name => `${config.baseURL}/avatars/${name}`;
    },
  },
  created () {
    this.randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) +',' +
                                (Math.floor(Math.random() * 256)) + ',' +
                                (Math.floor(Math.random() * 256)) + ')';
    if (this.beforeAvatar !== '') {
      this.preview = this.filteredImgURL(this.beforeAvatar);
    }
  },
  methods: {
    onSelect (event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.preview = URL.createObjectURL(file);
        this.$emit('input', file);
      }
    },
  },
};
</script>

<style scoped>
.column {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="file"] {
    display: none;
}

label {
  margin-top: 8px;
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
