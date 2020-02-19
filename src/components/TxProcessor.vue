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
import { isNull } from 'lodash';
import { soliditySha3 } from 'web3-utils';

export default {
  computed: {
    ...mapState([
      'web3',
      'user',
      'txsPending',
      'WTON',
    ]),
  },
  async created () {
    this.$bus.$on('txSended', async (tx) => {
      await this.processTx(tx);
    });
  },
  beforeDestroy () {
    this.$bus.$off('txSended', () => {});
  },
  methods: {
    async processTx (tx) {
      const request = tx.request;
      const func = tx.txSender;

      await this.$store.dispatch('addPendingTx', request);

      let receipt;
      try {
        receipt = (await func()).receipt;
        console.log('tx mined');

        if (receipt.status === true && request === 'delegate') await this.processDepositLog(receipt);
        else if (receipt.status === true && request === 'withdraw') await this.processRequestProcessLog(receipt);
        await this.$store.dispatch('set');

        alert(`${request} 트랜잭션 처리가 완료되었습니다.`);
      } catch (e) {
        if (e.message.includes('User denied transaction signature')) {
          alert(`${request} 트랜잭션 서명을 거부했습니다.`);
        }
        console.log(e.message);
      } finally {
        await this.$store.dispatch('deletePendingTx', request);
      }
    },
    async processDepositLog (receipt) {
      for (const log of receipt.rawLogs) {
        // TODO: check encodeEventSignature
        // this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256')
        if (log.topics[0] === '0x8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a7') {
          const transactionHash = receipt.transactionHash;
          const params = this.web3.eth.abi.decodeParameters(
            ['address', 'uint256'],
            log.data
          );
          const amount = params[1];

          await addHistory(this.user, {
            request: 'DEPOSIT',
            amount,
            transactionHash: receipt.transactionHash,
          });

          return;
        }
      }
    },
    async processRequestProcessLog (receipt) {
      for (const log of receipt.logs) {
        if (log.event === 'WithdrawalProcessed') {
          const transactionHash = receipt.transactionHash;
          const amount = (log.args.amount).toString(10);

          await addHistory(this.user, {
            request: 'WITHDRAWAL',
            amount,
            transactionHash: receipt.transactionHash,
          });

          return;
        }
      }
    },
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
