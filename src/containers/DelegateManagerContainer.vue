<template>
  <div class="delegate-manager-container">
    <div class="container">
      <div class="row">
        <div class="title">Staking</div>
        <base-tab :left-label="'Delegate'" :right-label="'Undelegate'" :tab="tab" @tab-changed="changeTab" />
      </div>
      <div class="divider" />
      <form v-if="tab === 'left'">
        <div class="column">
          <ton-input v-model="amountToDelegate" :amount="amountToDelegate" />
          <text-viewer :title="'Available Amount'" :content="tonBalance" />
          <div class="button-container"><base-button :label="'Delegate TON'" :func="delegate" /></div>
        </div>
      </form>
      <form v-else>
        <div class="column">
          <ton-input v-model="amountToUndelegate" :amount="amountToUndelegate" />
          <text-viewer :title="'Available Amount'" :content="convertedTONFromWTON(operator.userStaked)" />
          <div class="button-container"><base-button :label="'Request Undelegate TON'" :func="undelegate" /></div>
          <div class="divider" />
          <text-viewer :title="'Pending Amount'" :content="convertedTONFromWTON(userPending)" />
          <text-viewer :title="'Withdrawable Amount'" :content="convertedTONFromWTON(userWithdrawable)" />
          <div class="button-container"><base-button :label="'Process Requests'" :func="processRequests" /></div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { padLeft } from 'web3-utils';
import { addHistory, addTransaction, updateTransactionState } from '@/api';

import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import BaseButton from '@/components/BaseButton.vue';
import BaseTab from '@/components/BaseTab.vue';
import TONInput from '@/components/TONInput.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'base-button': BaseButton,
    'base-tab': BaseTab,
    'ton-input': TONInput,
    'text-viewer': TextViewer,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      tab: 'left',
      amountToDelegate: '',
      amountToUndelegate: '',
    };
  },
  computed: {
    ...mapState([
      'web3',
      'user',
      'tonBalance',
      'wtonBalance',
      'DepositManager',
      'RootChainRegistry',
      'TON',
      'WTON',
    ]),
    userPending () {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));

      return this.operator.pendingRequests.reduce(reducer, initialAmount);
    },
    userWithdrawable () {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));

      return this.operator.withdrawableRequests.reduce(reducer, initialAmount);
    },
    convertedTONFromWTON () {
      return wtonAmount => _TON(wtonAmount.toNumber());
    },
  },
  methods: {
    changeTab (tab) {
      this.tab = tab;
    },
    async delegate () {
      if (this.amountToDelegate === '') return alert('Please check input amount.');
      if (_TON(this.amountToDelegate).gt(this.tonBalance)) return alert('Please check your TON amount.');

      const data = this.getData();
      const amount = _TON(this.amountToDelegate).toFixed('wei');

      this.TON.methods.approveAndCall(
        this.WTON._address,
        amount,
        data,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          this.$store.dispatch('addPendingTx', hash);
          await addTransaction(this.user, hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // default: 24
        })
        .on('receipt', async (receipt) => {
          await this.processDepositLog(receipt);
          await updateTransactionState(receipt.transactionHash);

          await this.$store.dispatch('set');
          this.$store.dispatch('deletePendingTx', receipt.transactionHash);

          this.$emit('refresh');
        })
        .on('error', function (error, receipt) {
          alert('error', error);
        });

      this.amountToDelegate = '';
    },
    async undelegate () {
      if (this.amountToUndelegate === '') return alert('Please check input amount.');
      if (_WTON(this.amountToUndelegate).gt(this.operator.userStaked)) return alert('Please check your TON amount.');

      const amount = _WTON(this.amountToUndelegate).toFixed('ray');

      this.DepositManager.methods.requestWithdrawal(
        this.operator.rootchain,
        amount,
      ).send({ from: this.user })
        .on('transactionHash', (hash) => {
          this.$store.dispatch('addPendingTx', hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // default: 24
        })
        .on('receipt', async (receipt) => {
          await this.$store.dispatch('set');
          this.$store.dispatch('deletePendingTx', receipt.transactionHash);

          this.$emit('refresh');
        })
        .on('error', function (error, receipt) {
          alert('error', error);
        });

      this.amountToUndelegate = '';
    },
    async processRequests () {
      if (this.userWithdrawable.isEqual(_WTON.ray('0'))) {
        return alert('cannot be withdrawable');
      }

      const count = this.operator.withdrawableRequests.length;
      if (count === 0) {
        return alert('cannot be withdrawable');
      }
      this.DepositManager.methods.processRequests(
        this.operator.rootchain,
        count,
        true,
      ).send({ from: this.user })
        .on('transactionHash', (hash) => {
          this.$store.dispatch('addPendingTx', hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // default: 24
        })
        .on('receipt', async (receipt) => {
          await this.processRequestProcessLog(receipt);

          await this.$store.dispatch('set');
          this.$emit('refresh');
          this.$store.dispatch('deletePendingTx', receipt.transactionHash);
        });
    },
    async processDepositLog (receipt) {
      const event = receipt.events[0];
      const depositedEvent = this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256)');

      if (event.raw.topics[0] === depositedEvent) {
        const transactionHash = receipt.transactionHash;
        const params = this.web3.eth.abi.decodeParameters(
          ['address', 'uint256'],
          event.raw.data
        );
        const amount = params[1];

        await addHistory(this.user, {
          request: 'DEPOSIT',
          amount,
          transactionHash: receipt.transactionHash,
        });

        return;
      }
    },
    async processRequestProcessLog (receipt) {
      const process = async (event) => {
        const amount = event.returnValues.amount;

        await addHistory(this.user, {
          request: 'WITHDRAWAL',
          amount,
          transactionHash: receipt.transactionHash,
        });
      };

      const event = receipt.events.WithdrawalProcessed;
      if (event.length) {
        event.forEach(async e => await process(e));
      } else {
        await process(event);
      }
    },
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    marshalString (str) {
      if (str.slice(0, 2) === '0x') return str;
      return '0x'.concat(str);
    },
    unmarshalString (str) {
      if (str.slice(0, 2) === '0x') return str.slice(2);
      return str;
    },
    getData () {
      const data = this.marshalString(
        [this.DepositManager._address, this.operator.rootchain]
          .map(this.unmarshalString)
          .map(str => padLeft(str, 64))
          .join('')
      );
      return data;
    },
  },
};
</script>

<style scoped>
.delegate-manager-container {
  background: #ffffff;
  width: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
}

.container {
  padding: 16px;
}

.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.title {
  flex: 1;
  font-size: 18px;
  line-height: 2;
}

.divider {
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 1px;
  background: #b4b4b4;
}

.button-container {
  color: #ffffff;
  background-color: #6fc4b3;
  border: 1px solid #6fc4b3;
  text-align: center;
  margin-top: 16px;
  width: 100%;
  font-size: 14px;
  line-height: 2.5;
  border-radius: 4px;
}

.button-container:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}
</style>
