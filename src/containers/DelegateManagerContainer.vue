<template>
  <div class="delegate-manager-container">
    <div class="row-reverse">
      <base-tab :left-label="'Delegate'" :right-label="'Undelegate'" :tab="tab" @tab-changed="changeTab" />
    </div>
    <form v-if="tab === 'left'">
      <div class="column">
        <ton-input v-model="amountToDelegate" :amount="amountToDelegate" @token="ChangeToken" />
        <div v-if="selectedToken === 'TON'" class="row">
          <span class="available-amount-label">Available TON Amount</span>
          <button type="button" class="available-amount" @click="setAvailableAmountToDelegate()">{{ currencyAmount(tonBalance) }}</button>
        </div>
        <div v-if="selectedToken === 'WTON'" class="row">
          <span class="available-amount-label">Available WTON Amount</span>
          <button type="button" class="available-amount" @click="setAvailableWTONAmountToDelegate()">{{ currencyAmount(wtonBalance).slice(0,-4) }} WTON</button>
        </div>
        <div class="button-container" style="margin-top: 24px;">
          <base-button-d v-if="operatorMinimumAmount" :label="'Delegate'" :func="selectedToken === 'WTON'? wtonApprove:delegate" />
          <base-button v-else :label="'Delegate'" :func="selectedToken === 'WTON'? wtonApprove:delegate" />
        </div>
        <div class="divider" />
        <div class="row">
          <span class="available-amount-label">Available Amount</span>
          <button type="button"
                  class="available-amount"
                  @click="increaseIndex()"
          >
            {{ redelegatableAmount | currencyAmount }}
          </button>
        </div>
        <div class="button-container" style="margin-top: 24px;">
          <base-button :label="'Re-Delegate'" :func="redelegate" />
        </div>
      </div>
    </form>
    <form v-else>
      <div class="column">
        <ton-input v-model="amountToUndelegate" :amount="amountToUndelegate" @token="ChangeToken" />
        <div class="row">
          <span class="available-amount-label">Available Amount</span>
          <button type="button" class="available-amount" @click="setAvailableAmountToUndelegate()">{{ currencyAmount(operator.userStaked) }}</button>
        </div>
        <div class="button-container" style="margin-top: 24px;"><base-button :label="'Undelegate'" :func="undelegate" /></div>
        <div class="divider" />
        <text-viewer :title="'Not Withdrawable'"
                     :content="selectedToken==='TON'?currencyAmount(operator.userNotWithdrawable) :`${currencyAmount(operator.userNotWithdrawable).slice(0,-4)} WTON`"
                     :tooltip="operator.notWithdrawableRequests.length !== 0 ? notWithdrawableMessage(withdrawableBlockNumber(operator.notWithdrawableRequests)) : ''"
                     :tooltipWidth="'200px'"
                     :tooltipMarginTop="'-17px'"
                     style="margin-bottom: -2px;"
        />
        <text-viewer :title="'Withdrawable'"
                     :content="selectedToken==='TON'?currencyAmount(operator.userWithdrawable):`${currencyAmount(operator.userWithdrawable).slice(0,-4)} WTON`"
        />
        <div class="button-container" style="margin-top: 16px;"><base-button :label="'Withdraw'" :func="selectedToken==='TON'?processRequests:processWtonRequests" /></div>
      </div>
    </form>
  </div>
</template>

<script>
import { BN, padLeft } from 'web3-utils';
import { range } from 'lodash';
import { addHistory, addTransaction } from '@/api';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState, mapGetters } from 'vuex';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtonDisable from '@/components/BaseButtonDisable.vue';
import BaseTab from '@/components/BaseTab.vue';
import TONInput from '@/components/TONInput.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'base-button': BaseButton,
    'base-button-d': BaseButtonDisable,
    'base-tab': BaseTab,
    'ton-input': TONInput,
    'text-viewer': TextViewer,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      tab: 'left',
      amountToDelegate: '',
      amountToUndelegate: '',
      index: 0,
      selectedToken:'TON',
    };
  },
  computed: {
    ...mapState([
      'web3',
      'blockNumber',
      'user',
      'tonBalance',
      'TON',
      'WTON',
      'DepositManager',
      'SeigManager',
      'wtonBalance',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    notWithdrawableMessage () {
      return withdrawableBlockNumber => `You have to wait for ${withdrawableBlockNumber - this.blockNumber} blocks to withdraw all the tokens.`;
    },

    withdrawableRequests () {
      return this.operator.withdrawalRequests.length;
    },
    redelegatableRequests () {
      return this.operator.withdrawalRequests.length - this.index;
    },
    redelegatableAmount () {
      let amount = new BN(0);
      for (const i of range(this.redelegatableRequests)) {
        amount = amount.add(new BN(this.operator.withdrawalRequests[i].amount));
      }
      return _WTON(amount.toString(), 'ray');
    },
    disableButton () {
      return false;
    },
    minimumAmount () {
      return this.SeigManager.methods.minimumAmount().call();
    },
    operatorMinimumAmount (){
      const operatorDeposit = this.operator.selfDeposit;
      const minimumAmount = this.operator.minimumAmount;
      const lessThan = operatorDeposit < minimumAmount;
      if (this.user !== this.operator.address ) {
        return lessThan;
      }
      else {
        return false;
      }
    },
  },
  methods: {
    ChangeToken (token) {
      this.selectedToken = token;
      this.amountToDelegate = '';
      this.amountToUndelegate = '';
    },
    withdrawableBlockNumber (requests) {
      const numbers = requests.map(request => request.withdrawableBlockNumber);
      return Math.max(...numbers);
    },
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
    setAvailableWTONAmountToDelegate () {
      const wtonAmount = this.wtonBalance.toBigNumber().toString();
      const index = wtonAmount.indexOf('.');
      if (index === -1) {
        this.amountToDelegate = wtonAmount + '.00';
      } else {
        this.amountToDelegate = wtonAmount;
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
    increaseIndex () {
      this.index++;
      if (this.operator.withdrawalRequests.length === 0 ||
          this.index === this.operator.withdrawalRequests.length) {
        this.index = 0;
      }
    },
    async delegate () {
      if (this.amountToDelegate === '' || parseFloat(this.amountToDelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_TON(this.amountToDelegate).gt(this.tonBalance)) {
        return alert('Please check your TON amount.');
      }
      if(confirm('Current withdrawal delay is 2 weeks. Are you sure you want to delegate?')){
        const data = this.getData();
        // let gasLimit;
        const amount = _TON(this.amountToDelegate).toFixed('wei');
        const gasLimit = await this.TON.methods.approveAndCall(
          this.WTON._address,
          amount,
          data,
        ).estimateGas( { from: this.user } );

        await this.TON.methods.approveAndCall(
          this.WTON._address,
          amount,
          data,
        ).send({
          from: this.user,
          gasLimit: Math.floor(gasLimit * 1.2),
        }).on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Delegated',
            amount: amount,
            transactionHash: hash,
            target: this.operator.layer2,
          };
          this.$store.dispatch('addPendingTransaction', transcation);
        })
          .on('receipt', (receipt) => {
            this.index = 0;
          });

        this.amountToDelegate = '';
      }
    },
    async wtonApprove () {
      if (this.amountToDelegate === '' || parseFloat(this.amountToDelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_WTON(this.amountToDelegate).gt(this.wtonBalance)) {
        return alert('Please check your WTON amount.');
      }
      if(confirm('Current withdrawal delay is 2 weeks. Are you sure you want to delegate?')){
        const data = this.getData();
        const amount = _WTON(this.amountToDelegate).toFixed('ray');
        const gasLimit = await this.WTON.methods.approve(
          this.DepositManager._address,
          amount,
        ).estimateGas({ from: this.user });

        this.WTON.methods.approve(
          this.DepositManager._address,
          amount,
        ).send({
          from: this.user,
          gasLimit: Math.floor(gasLimit * 1.2),
        }).on(
          'transactionHash', async (hash) => {
            const transcation = {
              from: this.user,
              type: 'Delegated',
              amount: amount,
              transactionHash: hash,
              target: this.operator.layer2,
            };
            this.$store.dispatch('addPendingTransaction', transcation);
          }
        )
          .on('receipt', (receipt) => {
            this.index = 0;
            this.wtonDelegate();
          });

        this.amountToDelegate = '';
      }
    },
    async wtonDelegate () {
      const amount = await this.WTON.methods.allowance(this.user, this.DepositManager._address).call();
      const bigAmount = new BN(amount);
      const wtonAmount = _WTON(bigAmount.toString(), 'ray');
      const delegateAmount = _WTON(wtonAmount).toFixed('ray');

      const gasLimit = await this.DepositManager.methods.deposit(
        this.operator.layer2,
        delegateAmount,
      ).estimateGas({
        from: this.user,
      });

      this.DepositManager.methods.deposit(
        this.operator.layer2,
        delegateAmount,
      ).send({
        from: this.user,
        gasLimit: Math.floor(gasLimit * 1.2),
      }).on(
        'transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Delegated',
            amount: delegateAmount,
            transactionHash: hash,
            target: this.operator.layer2,
          };
          this.$store.dispatch('addPendingTransaction', transcation);
        }
      )
        .on('receipt', (receipt) => {
          this.index = 0;
        });
    },
    async redelegate () {
      if (this.operator.withdrawalRequests.length === 0) {
        return alert('Redelegatable amount is 0.');
      }
      const amount = this.redelegatableAmount.toFixed('ray');
      const gasLimit = await this.DepositManager.methods.redepositMulti(
        this.operator.layer2,
        this.redelegatableRequests,
      ).estimateGas({
        from: this.user,
      });

      await this.DepositManager.methods.redepositMulti(
        this.operator.layer2,
        this.redelegatableRequests,
      ).send({
        from: this.user,
        gasLimit: Math.floor(gasLimit * 1.2),
      }).on('transactionHash', async (hash) => {
        const transcation = {
          from: this.user,
          type: 'Redelegated',
          amount: amount,
          transactionHash: hash,
          target: this.operator.layer2,
        };
        this.$store.dispatch('addPendingTransaction', transcation);
      })
        .on('receipt', (receipt) => {
          this.$store.dispatch('set', this.web3);
          this.index = 0; // after contract state is updated, display max redelegatable amount.
        });
    },
    async undelegate () {
      if (this.amountToUndelegate === '' || parseFloat(this.amountToUndelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_WTON(this.amountToUndelegate).gt(this.operator.userStaked)){
        return alert('Please check your TON amount.');
      }

      const amount = _WTON(this.amountToUndelegate).toFixed('ray');
      const gasLimit = await this.DepositManager.methods.requestWithdrawal(
        this.operator.layer2,
        amount,
      ).estimateGas({
        from: this.user,
      });

      await this.DepositManager.methods.requestWithdrawal(
        this.operator.layer2,
        amount,
      ).send({
        from: this.user,
        gasLimit: Math.floor(gasLimit * 1.2),
      }).on('transactionHash', async (hash) => {
        const transcation = {
          from: this.user,
          type: 'Undelegated',
          amount: amount,
          transactionHash: hash,
          target: this.operator.layer2,
        };
        this.$store.dispatch('addPendingTransaction', transcation);
      })
        .on('receipt', (receipt) => {
          this.index = 0;
        });

      this.amountToUndelegate = '';
    },
    async processRequests () {
      const userWithdrawable = this.operator.userWithdrawable;
      if (userWithdrawable.isEqual(_WTON.ray('0'))) {
        return alert('Withdrawable amount is 0.');
      }
      const count = this.operator.withdrawableRequests.length;
      if (count === 0) {
        return alert('Withdrawable amount is 0.');
      }

      const amount = _WTON(userWithdrawable).toFixed('ray');

      const gasLimit = await this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        true,
      ).send({
        from: this.user,
      });

      await this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        true,
      ).send({
        from: this.user,
        gasLimit: Math.floor(gasLimit * 1.2),
      }).on('transactionHash', async (hash) => {
        const transcation = {
          from: this.user,
          type: 'Withdrawn',
          amount: amount,
          transactionHash: hash,
          target: this.operator.layer2,
        };
        this.$store.dispatch('addPendingTransaction', transcation);
      })
        .on('receipt', async receipt => {
          this.index = 0;
        });
    },
    async processWtonRequests () {
      const userWithdrawable = this.operator.userWithdrawable;
      if (userWithdrawable.isEqual(_WTON.ray('0'))) {
        return alert('Withdrawable amount is 0.');
      }
      const count = this.operator.withdrawableRequests.length;
      if (count === 0) {
        return alert('Withdrawable amount is 0.');
      }

      const amount = _WTON(userWithdrawable).toFixed('ray');

      const gasLimit = await this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        false,
      ).send({
        from: this.user,
      });

      await this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        false,
      ).send({
        from: this.user,
        gasLimit: Math.floor(gasLimit * 1.2),
      }).on('transactionHash', async (hash) => {
        const transcation = {
          from: this.user,
          type: 'Withdrawn',
          amount: amount,
          transactionHash: hash,
          target: this.operator.layer2,
        };
        this.$store.dispatch('addPendingTransaction', transcation);
      })
        .on('receipt', async receipt => {
          this.index = 0;
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
        [this.DepositManager._address, this.operator.layer2]
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

.available-amount-label {
  margin-top: 8px;
  flex: 1;
  padding-left: 16px;
  margin-right: 24px;
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.available-amount {
  margin-top: 8px;
  margin-right: 12px;
  outline:none;
  border: none;
  cursor: pointer;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.popup {
  display: flex;
  justify-content: center;
}
</style>
