
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {},
    'is-token': {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      filteredContent: '',
    };
  },
  created () {
    if (this.isToken) this.filteredContent = this.$options.filters.convertedTONFromWTON(this.content);
    else this.filteredContent = this.content;
  },
};
