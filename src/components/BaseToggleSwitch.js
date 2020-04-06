
import { mapGetters } from 'vuex';

export default {
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    check: {
      type: Function,
      default: () => {},
    },
    uncheck: {
      type: Function,
      default: () => {},
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle (evt) {
      if (!this.disable)
        if (this.checked) this.uncheck();
        else this.check();

      evt.preventDefault();
    },
  },
};
