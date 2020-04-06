
export default {
  methods: {
    clickMenu (path) {
      if (`/${path}` === this.$route.path) {
        return;
      }
      this.$router.push(`/${path}`);
    },
    logout () {
      this.$store.dispatch('logout');
      this.$router.replace('/');
    },
  },
};
