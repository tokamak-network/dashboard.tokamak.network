
import { mapState } from 'vuex';

export default {
  methods: {
    onChange (value) {
      this.$emit('valueChanged', value);
    },
  },
};
