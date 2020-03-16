<template>
  <div>
    <div
      v-for="hash in txsPending"
      :key="hash"
    >
      <div class="tx-processor">
        <p class="message">
          Pending transaction (
          <a
            class="header-link"
            target="_blank"
            rel="noopener noreferrer"
            :href="explorerURL(hash)"
          >{{ hash }}</a> ), waiting to be confirmed...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data () {
    return {
      prefix: '',
    };
  },
  computed: {
    ...mapState([
      'txsPending',
    ]),
    explorerURL () {
      return hash => `${this.prefix}/${hash}`;
    },
  },
  created () {
    this.prefix = process.env.VUE_APP_EXPLORER_PREFIX;
  },
};
</script>

<style scoped>
.tx-processor {
  width: 960px;
  display: table;
  border-radius: 7px;
  border: solid 0.7px #ced6d9;
  background: red; height: 36px; background: #5ba7d8;
  color: white;
  margin-top: 8px;
  margin-bottom: -8px;
}

.message {
  padding-left: 16px;
  vertical-align: middle;
  display: table-cell;
}
</style>
