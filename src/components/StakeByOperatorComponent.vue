<template>
  <div class="operator-container">
    <div class="operator-title">
      <avatar class="avatar" fullname="O P R" :image="filteredImgURL(operator.avatar)" :size="50" :color="operator.color" />
      <div class="operator-name">{{ operator.name }}</div>
      <div class="available-amount-container">
        <div>Available Amount</div>
        <div>{{ currencyAmount(tonBalance) }}</div>
      </div>
      <div class="input-container">
        <div class="text">Amount</div>
        <div class="input-text">
          <input v-model="amountToDelegate" class="value-input" autocomplete="off" minlength="1" maxlength="79" placeholder="0.00" @keypress="isNumber">
          <div>TON</div>
        </div>
      </div>
      <button class="select-button" @click="delegate()">Stake</button>
    </div>
    <div v-if="user === operator.address">
      <button class="select-button" @click="showEditContainer">Edit</button>
    </div>
    <transition v-if="showEdit" name="model">
      <div class="model-mask">
        <div class="model-container">
          <EditOperatorComponent :layer2="operator.layer2" @showEditContainer="showEditContainer" />
        </div>
      </div>
    </transition>
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
import { getConfig } from '../../config.js';
import Avatar from 'vue-avatar-component';
import EditOperatorComponent from '@/components/EditOperatorComponent.vue';


export default {
  components: {
    'avatar': Avatar,
    'EditOperatorComponent':EditOperatorComponent,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      tab: 'Delegate',
      selectedOperator: '',
      amount: '',
      amountToDelegate: '',
      amountToUndelegate: '',
      index: 0,
      showEdit:false,
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
    filteredImgURL () {
      return name => name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
    },
    rateOf () {
      return commissionRate => this.$options.filters.rateOf(commissionRate);
    },
    // delete
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
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
  methods:{
    showEditContainer () {
      this.showEdit = !this.showEdit;
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
.operator-container {
  padding: 10px;
  width: 280px;
  background-color:#e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
}
.information {
    text-decoration: none;
    color: #555555;
    display: flex;
    float: right;
   /* justify-content:flex-end; */
   font-size: 10px;
   padding: 5px;
   background: #e2e2e2;
   border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
}
.operator-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5px;
    padding-top: 10px;
    width: 100%;
    color: #555555;
}
.operator-name {
    font-size: 23px;
    font-weight: 700;
    padding: 10px;
}
.avatar {
    margin-top: -5px;

}
.available-amount-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    font-size: 14px;
    padding:5px 0px 15px 0px;
    width: 97%;
}
.input-container {
    background-color: white;
    width: 90%;
    border-radius: 12px;
    padding: 0px 15px;
    margin: 0px 5px 20px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 14px;
}
.value-input {
    text-align: right;
  height: 20px;
  border: none;
  /* background-color:#e2e8eb; */
  font-size: 14px;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80px;
    margin-right: 20px;
    align-items: center;
     color: #555555;
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
.select-button {
    width: 100%;
    height: 37px;
    border-radius: 12px;
    border: none;
    background:  #2a72e5;
    color: #e2e2e2;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
}
button:focus {
  outline: none;
}
button:hover {
  color: #555555;
}
.input-text {
    display: flex;
    flex-direction: row;
}
.model-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: opacity 0.3s ease;

}
.model-container {
  display: flex;
  justify-content: center;
    align-content: center;
    margin-top: 50px;
}
</style>
