<template>
  <div class="delegate-manager">
    <div class="delegate-manager-container">
      <div class="header">
        <div class="title">
          Staking
        </div>
        <button
          class="tab left"
          :class="{ 'delegate-clicked': tab === 'delegate' }"
          @click="changeTab('delegate')"
        >
          Delegate
        </button>
        <button
          class="tab right"
          :class="{ 'undelegate-clicked': tab === 'undelegate' }"
          @click="changeTab('undelegate')"
        >
          Undelegate
        </button>
      </div>
      <div class="divider" />
      <form v-if="tab === 'delegate'">
        <div class="body">
          <div class="has-border">
            AMOUNT
          </div>
          <div class="ton-input">
            <input
              v-model="amountToDelegate"
              class="input-delegate"
              @keypress="isNumber"
            >
          </div>
          <div class="has-border">
            TON
          </div>
        </div>
        <div style="display: flex; margin-top: 8px;">
          <div style="flex: 1; font-size: 14px; color: #586064">
            Available Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            {{ tonBalance }}
          </div>
        </div>
        <div
          class="request-button"
          style="margin-top: 192px;"
        >
          <base-button
            :label="'Delegate TON'"
            :func="delegate"
          />
        </div>
      </form>
      <form v-else>
        <div class="body">
          <div class="has-border">
            AMOUNT
          </div>
          <div class="ton-input">
            <input
              v-model="amountToUndelegate"
              class="input-undelegate"
              @keypress="isNumber"
            >
          </div>
          <div class="has-border">
            TON
          </div>
        </div>
        <div style="display: flex;  padding-top: 8px;">
          <div style="flex: 1; font-size: 14px; color: #586064;">
            Available Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            {{ operator.userStake | convertToTON }}
          </div>
        </div>
        <div
          class="request-button"
          style="margin-top: 40px;"
        >
          <base-button
            :label="'Request Undelegate TON'"
            :func="undelegate"
          />
        </div>
        <div class="divider" />
        <div style="display: flex; margin-top: 40px;">
          <div style="flex: 1; font-size: 14px; color: #586064;">
            Requests
          </div>
          <div style="font-size: 14px; color: #586064">
            {{ operator.pendingRequests.length }}
          </div>
        </div>
        <div style="display: flex;">
          <div style="flex: 1; font-size: 14px; color: #586064">
            Pending Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            {{ operator.userPendingUnstaked | convertToTON }}
          </div>
        </div>
        <div class="request-button">
          <base-button
            :label="'Process Requests'"
            :func="processRequests"
            :disable="operator.pendingRequests.length === 0"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { padLeft } from 'web3-utils';
import { addHistory } from '@/api';

import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import BaseButton from '@/components/BaseButton.vue';

export default {
  components: {
    'base-button': BaseButton,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      param: '',
      tab: 'delegate',
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
      'TON',
      'WTON',
    ]),
    ...mapGetters([
      'userUndepositedBalance',
      'operatorByRootchain',
    ]),
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
        .on('transactionHash', (hash) => {
          this.$store.dispatch('addPendingTx', hash);
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          // default: 24
        })
        .on('receipt', async (receipt) => {
          await this.processDepositLog(receipt);

          await this.$store.dispatch('set');
          this.$emit('refresh');
          this.$store.dispatch('deletePendingTx', receipt.transactionHash);
        })
        .on('error', function (error, receipt) {
          alert('tx errors');
        });

      this.amountToDelegate = '';
    },
    async undelegate () {
      if (this.amountToUndelegate === '') return alert('Please check input amount.');
      if (_WTON(this.amountToUndelegate).gt(this.operator.userStake)) return alert('Please check your TON amount.');

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
          this.$emit('refresh');
          this.$store.dispatch('deletePendingTx', receipt.transactionHash);
        })
        .on('error', function (error, receipt) {
          //
        });

      this.amountToUndelegate = '';
    },
    async processRequests () {
      if (this.operator.pendingRequests.length === 0) return;

      const count = await this.getWithdrawableRequestCount();
      if (count === 0) return alert('You have to wait withdrawal delay');

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

      // TODO: check encodeEventSignature
      // this.web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256')
      if (event.raw.topics[0] === '0x8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a7') {
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
    async getWithdrawableRequestCount () {
      const blockNumber = await this.web3.eth.getBlockNumber();

      let count = 0;
      this.operator.pendingRequests.map(request => {
        if (request.withdrawableBlockNumber <= blockNumber)
          count++;
      });
      return count;
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
.delegate-manager {
  background: #ffffff;
  width: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
}

.delegate-manager-container {
  padding: 16px;
}

.header {
  display: flex;
}

.title {
  flex: 1;
  font-size: 18px;
  line-height: 2;
}

.input-delegate {
  height: 26px;
  border: none;
  border-right: 0px;
  border-top: 0px;
  border-left: 0px;
  border-bottom: 0px;
  width: 100%;
  border-top: 1px solid #b4b4b4;
  border-bottom: 1px solid #b4b4b4;
  font-size: 16px;
  text-align: right;
  padding-right: 16px;
}

.input-undelegate {
  height: 26px;
  border:none;
  border-right: 0px;
  border-top: 0px;
  border-left: 0px;
  border-bottom:0px;
  width: 100%; border-top: 1px solid #b4b4b4;
  border-bottom: 1px solid #b4b4b4;
  font-size: 16px;
  text-align: right;
  padding-right: 16px;
}

.tab {
  width: 90px;
  line-height: 2;
  font-size: 14px;
  text-align: center;
  color: #000000;
}

.tab:hover {
  cursor: pointer;
  background-color: #ecf1f3;
}

.delegate-clicked {
  background-color: #2868af;
  color: #ffffff;
  z-index: 2;
}

.delegate-clicked:hover {
  background-color: #1e4e85;
  color: #ffffff;
}

.undelegate-clicked {
  background-color: #f38777;
  color: #ffffff;
  z-index: 2;
}

.undelegate-clicked:hover  {
  background-color: #f06752;
  color: #ffffff;
}

.left {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  z-index: 2;
}

.right {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.divider{
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 1px;
  background: #b4b4b4;
}

.body {
  display: flex;
  width: 100%;
  height: 30px;
}

.ton-input {
  flex: 1;
  margin-right: 17px;
  z-index: 2;
}

.has-border {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #b4b4b4;
  padding-left: 4px;
  padding-right: 4px;
}

.request-button {
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

.request-button:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}
</style>
