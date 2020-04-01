<template>
  <div class="delegate-manager-container">
    <div class="row-reverse">
      <base-tab :left-label="'Delegate'" :right-label="'Undelegate'" :tab="tab" @tab-changed="changeTab" />
    </div>
    <form v-if="tab === 'left'">
      <div class="column">
        <ton-input v-model="amountToDelegate" :amount="amountToDelegate" />
        <text-viewer :title="'Available Amount'" :content="currencyAmount(tonBalance)" />
        <div class="button-container"><base-button :label="'Delegate TON'" :func="delegate" /></div>
      </div>
    </form>
    <form v-else>
      <div class="column">
        <ton-input v-model="amountToUndelegate" :amount="amountToUndelegate" />
        <text-viewer :title="'Available Amount'" :content="currencyAmount(operator.userStaked)" />
        <div class="button-container"><base-button :label="'Request Undelegate TON'" :func="undelegate" /></div>
        <div class="divider" />
        <text-viewer :title="'Not Withdrawable'" :content="currencyAmount(operator.userNotWithdrawable)" style="margin-bottom: -2px;" />
        <text-viewer :title="'Withdrawable'" :content="currencyAmount(operator.userWithdrawable)" />
        <div class="button-container"><base-button :label="'Process Requests'" :func="processRequests" /></div>
      </div>
    </form>
  </div>
</template>

<script>
import { padLeft } from 'web3-utils';
import { addHistory, addTransaction } from '@/api';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState } from 'vuex';
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
      required: true,
      type: Object,
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
      'TON',
      'WTON',
      'DepositManager',
    ]),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  methods: {
    changeTab (tab) {
      this.tab = tab;
    },
    async delegate () {
      if (this.amountToDelegate === '' || parseFloat(this.amountToDelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_TON(this.amountToDelegate).gt(this.tonBalance)) {
        return alert('Please check your TON amount.');
      }

      const data = this.getData();
      const amount = _TON(this.amountToDelegate).toFixed('wei');
      this.TON.methods.approveAndCall(
        this.WTON._address,
        amount,
        data,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            transactionHash: hash,
            target: this.operator.rootchain,
          };
          const pendingTransaction = await addTransaction(transcation);
          this.$store.dispatch('addPendingTransaction', pendingTransaction);
        })
        .on('error', function (error, receipt) {
          alert('error', error);
        });

      this.amountToDelegate = '';
    },
    async undelegate () {
      if (this.amountToUndelegate === '' || parseFloat(this.amountToUndelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_WTON(this.amountToUndelegate).gt(this.operator.userStaked)){
        return alert('Please check your TON amount.');
      }

      const amount = _WTON(this.amountToUndelegate).toFixed('ray');
      this.DepositManager.methods.requestWithdrawal(
        this.operator.rootchain,
        amount,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            transactionHash: hash,
            target: this.operator.rootchain,
          };
          const pendingTransaction = await addTransaction(transcation);
          this.$store.dispatch('addPendingTransaction', pendingTransaction);
        })
        .on('error', function (error, receipt) {
          alert('error', error);
        });

      this.amountToUndelegate = '';
    },
    async processRequests () {
      if (this.operator.userWithdrawable.isEqual(_WTON.ray('0'))) {
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
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            transactionHash: hash,
            target: this.operator.rootchain,
          };
          const pendingTransaction = await addTransaction(transcation);
          this.$store.dispatch('addPendingTransaction', pendingTransaction);
        })
        .on('error', function (error, receipt) {
          alert('error', error);
        });
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
  display: flex;
  height: 100%;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  padding-bottom: 16px;
}

.row-reverse {
  display: flex;
  flex-direction: row-reverse;
  margin-right: 8px;
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
  margin-top: 24px;
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
  font-size: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  margin-left: 16px;
  margin-right: 16px;
  border-radius: 6px;
}

.button-container:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}
</style>
