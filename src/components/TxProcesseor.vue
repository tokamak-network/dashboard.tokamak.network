<template>
  <div>
    <div
      v-if="opened"
      class="container"
    >
      <div
        class="close-container"
      >
        <img
          class="close-button"
          src="@/assets/images/Close.png"
          width="12"
          height="12"
        >
      </div>
      {{ txHash }}
      {{ request }}
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      opened: false,
      txHash: '',
      request: '',
      message: '처리 중',
    };
  },
  async created () {
    this.$bus.$on('txSended', async (t) => {
      await this.$store.dispatch('processTx', 'sended');

      this.request = t.request;
      this.opened = true;

      let receipt;
      try {
        receipt = (await t.txSender()).receipt;

        this.message = '완료';
        this.txHash = receipt.transactionHash;

        await this.$store.dispatch('set');
        await this.$store.dispatch('processTx', 'mined');
      } catch (e) {
        if (e.message.includes('User denied transaction signature')) {
          alert('트랜잭션 서명을 거부했습니다.');
        }
        await this.$store.dispatch('processTx', 'failed');
      } finally {
        this.opened = false;
      }
    });
  },
  beforeDestroy () {
    this.$bus.$off('txSended', () => {});
  },
};
</script>

<style scoped>
.container {
  display: inherit;
  background: tomato;
  width: 100%;
  height: 165px;
}

.modal-close-container {
  display: flex;
  flex-direction: row-reverse;
  margin-top: -26px;
  margin-right: -40px;
  margin-bottom: 10px;
}

.modal-close-button {
  padding: 12px;
}
</style>
