
import config from '../../config.json';
import { mapState } from 'vuex';

import Avatar from 'vue-avatar-component';
import BaseButton from '@/components/BaseButton.js';

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
      return name => `${config.baseURL}/avatars/${name}`;
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
