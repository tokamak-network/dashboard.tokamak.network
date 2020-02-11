<template>
  <div>
    <div
      v-for="request in txsPending"
      :key="request"
    >
      <div class="tx-processor">
        {{ request }} 요청(transaction)을 처리하고 있습니다.
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { addHistory } from '@/api';

export default {
  computed: {
    ...mapState([
      'user',
      'txsPending',
    ]),
  },
  async created () {
    this.$bus.$on('txSended', async (t) => {
      const request = t.request;
      const sendTx = t.txSender;
      await this.$store.dispatch('addPendingTx', request);

      let receipt;
      try {
        receipt = (await sendTx()).receipt;
        const history = {
          request,
          status: receipt.status ? 'success' : 'failed',
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
        };
        await addHistory(this.user, history);
        await this.$store.dispatch('set');
        alert(`${request} 트랜잭션 처리가 완료되었습니다.`);
      } catch (e) {
        if (e.message.includes('User denied transaction signature')) {
          alert(`${request} 트랜잭션 서명을 거부했습니다.`);
        }
      } finally {
        await this.$store.dispatch('deletePendingTx', request);
      }
    });
  },
  beforeDestroy () {
    this.$bus.$off('txSended', () => {});
  },
};
</script>

<style scoped>
.tx-processor {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 7px;
  border: solid 0.7px #ced6d9;
  background: red; height: 36px; background: #5ba7d8;
  color: white;
  padding-left: 16px;
  margin-top: 8px;
  margin-bottom: -8px;
}
</style>
