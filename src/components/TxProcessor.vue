<template>
  <div>
    <div
      v-for="hash in txsPending"
      :key="hash"
    >
      <div class="tx-processor">
        <p class="message">
          Pending confirmation (
          <a
            class="header-link"
            target="_blank"
            rel="noopener noreferrer"
            :href="`https://etherscan.io/tx/${hash}`"
          >{{ hash }}</a> )
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'txsPending',
    ]),
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
