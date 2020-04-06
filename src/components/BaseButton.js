

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    func: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    async click () {
      if (!this.disable) {
        await this.func();
      }
    },
  },
};
