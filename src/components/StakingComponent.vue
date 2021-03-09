<template>
  <div class="staking-component-container">
    <div class="image-container">
      <img class="calc-img" src="@/assets/images/calculator_icon.png" @click="showSim = true">
    </div>
    <div class="ton-balance">
      <div>{{ tonBalance | currencyAmount }}</div>
      <div>Available in wallet</div>
    </div>
    <button @click="selectFunction('stake')">Stake</button>
    <div v-if="parseInt(operator.userStaked) !== 0 && operator.withdrawalRequests.length === 0">
      <div>
        <button @click="selectFunction('unstake')">Unstake</button>
      </div>
    </div>
    <div v-if="operator.withdrawalRequests.length !== 0">
      <div>
        <button @click="selectFunction('restake')">Re-stake</button>
      </div>
    </div>
    <div v-if="!(operator.userWithdrawable.isEqual(balance))">
      <button @click="selectFunction('withdraw')">Withdraw</button>
    </div>
    <transition v-if="showSim" name="model">
      <div class="model-mask">
        <div class="model-container">
          <simulator-modal @closePopup="closePopup" @openResultModal="openResultModal" />
        </div>
      </div>
    </transition>
    <transition v-if="showResultModal" name="model">
      <div class="model-mask-second">
        <div class="model-container">
          <simulator-result-modal :roi="roi" :rewardTON="rewardTON" :rewardUSD="rewardUSD" :rewardKRW="rewardKRW" :myStaked="myStaked" @closeModal="closeModal" @openStake="openStake" />
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
import SimulatorModal from '../components/SimulatorModal';
import SimulatorResultModal from '../components/SimulatorResultModal';

export default {
  components:{
    'simulator-modal':SimulatorModal,
    'simulator-result-modal': SimulatorResultModal,

  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      balance: _WTON.ray('0'),
      showSim: false,
      showResultModal: false,
      roi:0,
      rewardTON:0,
      rewardUSD:0,
      rewardKRW:0,
      myStaked:0,
    };
  },
  computed: {
    ...mapState([
      'tonBalance',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
  },
  methods: {
    selectFunction (method) {
      this.$emit('selectFunc', method);
    },
    closePopup (){
      this.showSim = false;
    },
    closeModal (){
      this.showResultModal = false;
    },
    openResultModal (roi, rewardTON, rewardUSD, rewardKRW, myStaked) {
      this.roi = roi;
      this.rewardTON = rewardTON;
      this.rewardUSD = rewardUSD;
      this.rewardKRW = rewardKRW;
      this.myStaked = myStaked;
      this.showResultModal = true;
    },
    openStake (){
      this.showResultModal = false;
      this.showSim = false;
      this.$emit('openStakeModal', this.myStaked);
    },
  },
};
</script>

<style scoped>
.staking-component-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
  padding: 5px 10px;
  justify-content: center;
}
.calc-img {
  height: 30px;
  width: 30px;
}
.image-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.ton-balance {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.button-container {
  display: flex;
justify-content: center;
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
.model-mask-second{
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 20%;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.6); */
  transition: opacity 0.3s ease;
}
.model-container {
  display: flex;
  justify-content: center;
    align-content: center;
    margin-top: 150px;
}
</style>
