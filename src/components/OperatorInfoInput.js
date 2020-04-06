
export default {
  props: {
    label: {
      type: String,
      default: '-',
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value);
    },
  },
};
