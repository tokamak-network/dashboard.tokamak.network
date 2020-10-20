<template>
  <div class="staking-component-container">
    <div class="button-container">
      <button class="tab-button" @click="changeTab('Delegate')"><div class="button-name" :class="{ 'menu-button-selected': tab === 'Delegate'}">Delegate</div></button>
      <button class="tab-button" @click="changeTab('Undelegate')"><div class="button-name" :class="{ 'menu-button-selected': tab === 'Undelegate'}">Undelegate</div></button>
      <button class="tab-button" @click="changeTab('Withdraw')"><div class="button-name" :class="{ 'menu-button-selected': tab === 'Withdraw'}">Withdraw</div></button>
    </div>
    <div v-if="tab === 'Delegate'" class="value-container">
      <div class="total-balance">TON Balance: {{ currencyAmount(tonBalance) }}</div>
      <div class="main-row">
        <input v-model="amountToDelegate" class="value-input" autocomplete="off" minlength="1" maxlength="79" placeholder="0.00" @keypress="isNumber">
        <button class="button-max" @click="setAvailableAmountToDelegate()">MAX</button>
        <img class="logo" src="@/assets/images/TokamakLogo.png">
        <div class="TON">TON</div>
      </div>
    </div>
    <div v-if="tab === 'Undelegate'" class="value-container">
      <div class="total-balance">Available Balance: {{ currencyAmount(operator.userStaked) }}</div>
      <div class="main-row">
        <input v-model="amountToUndelegate" class="value-input" autocomplete="off" minlength="1" maxlength="79" placeholder="0.00" @keypress="isNumber">
        <button class="button-max" @click="setAvailableAmountToUndelegate()">MAX</button>
        <img class="logo" src="@/assets/images/TokamakLogo.png">
        <div class="TON">TON</div>
      </div>
    </div>
    <div v-if="tab === 'Withdraw'" class="value-container">
      <div class="main-row">
        <div class="amount-title">Withdrawable Amount:</div>
        <img class="logo" style="margin-right: 15px; margin-left: 0px;" src="@/assets/images/TokamakLogo.png">
        <!-- <div class="amount-value">0.000</div> -->
        <div class="TON">{{ currencyAmount(operator.userNotWithdrawable) }}</div>
      </div>
    </div>
    <div class="select-operator-container">
      <div class="select-option">
        <select v-model="selectedOperator" class="unit-select" @change="onChange($event)">
          <option v-for="(op, i) in operators" :key="i" :value="op.name">{{ op.name }}</option>
        </select>
        Select Operator
      </div>
    </div>
    <button class="stake-button" @click="tab === 'Delegate' ? delegate() : tab === 'Undelegate'? undelegate() : processRequests()">{{ tab }}</button>
    <div v-if="tab === 'Delegate'" class="value-container" style="margin-top:2px; margin-bottom:10px">
      <div class="main-row" style="justify-content: space-between;">
        <div class="amount-title">Re-delegate Amount:</div>
        <img class="logo" style="margin-right: 15px; margin-left: 0px;" src="@/assets/images/TokamakLogo.png">
        <div class="TON">{{ currencyAmount(operator.userNotWithdrawable) }}</div>
      </div>
    </div>
    <button v-if="tab === 'Delegate'" class="stake-button" style="margin-top:0px" @click="redelegate">Re-delegate</button>
  </div>
</template>

<script>
import { BN, padLeft } from 'web3-utils';
import { range } from 'lodash';
import { addHistory, addTransaction } from '@/api';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import { mapState, mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';

export default {
  data () {
    return {
      tab: 'Delegate',
      layer2: '',
      selectedOperator: '',
      amount: '',
      amountToDelegate: '',
      amountToUndelegate: '',
      index: 0,
    };
  },
  computed: {
    ...mapState([
      'operators',
      'tonBalance',
      'web3',
      'blockNumber',
      'user',
      'TON',
      'WTON',
      'DepositManager',
      'SeigManager',
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
  created () {
    this.selectedOperator = this.operators[0].name;
    this.layer2 = this.operators[0].layer2;
  },
  methods:{
    changeTab (tab) {
      this.tab = tab;
    },
    onChange (event) {
      const operator =  this.operators.find(operator => operator.name === event.target.value);
      const root = operator.layer2;
      this.layer2 = root;
    },
    withdrawableBlockNumber (requests) {
      const numbers = requests.map(request => request.withdrawableBlockNumber);
      return Math.max(...numbers);
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
        const amount = _TON(this.amountToDelegate).toFixed('wei');
        this.TON.methods.approveAndCall(
          this.WTON._address,
          amount,
          data,
        ).send({ from: this.user })
          .on('transactionHash', async (hash) => {
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
    redelegate () {
      if (this.operator.withdrawalRequests.length === 0) {
        return alert('Redelegatable amount is 0.');
      }

      const amount = this.redelegatableAmount.toFixed('ray');

      this.DepositManager.methods.redepositMulti(
        this.operator.layer2,
        this.redelegatableRequests,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
          const transcation = {
            from: this.user,
            type: 'Redelegated',
            amount,
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
    undelegate () {
      if (this.amountToUndelegate === '' || parseFloat(this.amountToUndelegate) === 0) {
        return alert('Please check input amount.');
      }
      if (_WTON(this.amountToUndelegate).gt(this.operator.userStaked)){
        return alert('Please check your TON amount.');
      }

      const amount = _WTON(this.amountToUndelegate).toFixed('ray');
      this.DepositManager.methods.requestWithdrawal(
        this.operator.layer2,
        amount,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
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
    processRequests () {
      const userWithdrawable = this.operator.userWithdrawable;
      if (userWithdrawable.isEqual(_WTON.ray('0'))) {
        return alert('Withdrawable amount is 0.');
      }
      const count = this.operator.withdrawableRequests.length;
      if (count === 0) {
        return alert('Withdrawable amount is 0.');
      }

      const amount = _WTON(userWithdrawable).toFixed('ray');
      this.DepositManager.methods.processRequests(
        this.operator.layer2,
        count,
        true,
      ).send({ from: this.user })
        .on('transactionHash', async (hash) => {
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
.staking-component-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  background-color:#e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
  padding: 5px 10px;
  justify-content: center;
}
.button-container {
  display: flex;
  flex-direction: row;
  padding-top: 5px;
}
.tab-button {
  height: 25px;
  width: 100%;
  border: none;
  background-color:#e2e8eb;
  color: #999797;
    font-size: 16px;
}
.tab-button:focus {
  outline: none;
}
.tab-button:hover {
  color: #adadad;
  cursor: pointer;
}
.menu-button-selected {
  color: #444444;
}
.button-name {
  width: 100%;
}
.button-name:hover{
  cursor: pointer;
}
.value-container {
  margin-top: 15px;
  display: flex;
 padding: 5px 12px;
  align-items: center;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  flex-direction: column;
}
.total-balance {
  display: flex;
  align-self: flex-end;
  font-size: 12px;
}
.main-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;

}
.value-input {
  height: 25px;
  border: none;
  background-color:#ffffff;
  font-size: 18px;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 180px;
    margin-right: 20px;
    align-items: center;
     color: #555555;
     padding-left: 9px;
    border-radius: 8px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
input:focus {
  outline: none;
}
input:hover {
  outline: none;
}
.logo {
    height: 25px;
    width: 36px;
    margin-left: 20px;
    margin-right: 8px;
}

.button-max {
  background:  #ccd1d3;
  opacity: 0.5;
  padding: 5px 10px;
  margin: 5px;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
}
.button-max:hover {
  outline: none;
  cursor: pointer;
  color: #3a3a3a;
}
.TON {
  font-size: 16px;
  font-weight: 500;
  color: #555555;
  justify-self: flex-end;
  text-align: right;
}
.arrow {
  transform: rotate(270deg);
  display: flex;
  height: 15px;
  width: 15px;
  margin-top: 15px;
  margin-left: 50%;
}

.select-option {
  font-size: 16px;
  display: flex;
  text-align: right;
  color: #555555;
  align-items: center;
}
.unit-select {
  width: 150px;
  margin-left: 10px;
  margin-right: 35px;
  border: none;
  background: #e2e8eb;
  font-size: 16px;
  font-weight: 700;
  color: #555555;
}
select {
  width: 100%;
  border-radius: 4px;
  border: 1px #f1f1f1;
  height: 30px;
  font-weight: solid;
}
select:focus {
  outline: none;
}
.stake-button {
   margin-top: 15px;
width: 100%;
    height: 35px;
    border-radius: 12px;
    border: none;
    background:  #2a72e5;
    color: #e2e2e2;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
}
.select-operator-container {
  margin-top: 15px;
  display: flex;
 padding: 2px 12px;
  align-items: center;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
}
.amount-title {
  font-size: 14px;
  margin-right: 10px;
}
.amount-value {
  font-size: 16px;
}
.stake-button:hover {
  outline: none;
}
.stake-button:focus {
  outline: none;
}
</style>
