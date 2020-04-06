
export default {
  props: {
    leftLabel: {
      type: String,
    },
    rightLabel: {
      type: String,
    },
    tab: {
      type: String,
    },
  },
  methods: {
    onTabChanged (tab) {
      this.$emit('tab-changed', tab);
    },
  },
};
