
import { padLeft } from 'web3-utils';
import { addHistory, addTransaction } from '@/api';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState } from 'vuex';
import BaseButton from '@/components/BaseButton.js';
import BaseTab from '@/components/BaseTab.js';
import TONInput from '@/components/TONInput.js';
import TextViewer from '@/components/TextViewer.js';

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
    setAvailableAmountToDelegate () {
      const tonAmount = this.tonBalance.toBigNumber().toString();
      const index = tonAmount.indexOf('.');
      if (index === -1) {
        this.amountToDelegate = tonAmount + '.00';
      } else {
        this.amountToDelegate = tonAmount;
      }
    },
    setAvailableAmountToUndelegate () {
      const tonAmount = this.operator.userStaked.toBigNumber().toString();
      const index = tonAmount.indexOf('.');
      if (index === -1) {
        this.amountToUndelegate = tonAmount + '.00';
      } else {
        this.amountToUndelegate = tonAmount;
      }
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
          alert(error.message);
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
          alert(error.message);
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
          alert(error.message);
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
