<template>
  <div>
    <div
      v-for="transaction in pendingTransactions"
      :key="transaction.transactionHash"
    >
      <div class="tx-processor">
        <div class="loader" />
        <div class="label">Tx PENDING</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getConfig } from '../../config.js';

import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'pendingTransactions',
    ]),
  },
};
</script>

<style scoped>
.tx-processor {
  width: 150px;
  height: 33px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 19px;
  border: solid 1px #2a72e5;
  background-color: #ffffff;

  position: absolute;
  right: 60px;
  top: 90px;
}
.loader {
  width: 14px;
  height: 14px;

  border: 2px solid #d9e6fb;
  border-top: 2px solid #2a72e5;
  border-radius: 50%;

  animation: spin 2s linear infinite;

  margin-right: 16px;
  margin-left: -12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.label {
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #2a72e5;
}
/* .tx-processor:hover {
    cursor: pointer;
  } */
</style>
