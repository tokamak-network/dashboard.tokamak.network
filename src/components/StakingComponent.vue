<template>
  <div class="staking-component-container">
    <div class="sim-container">
      <div class="sim" @click="showSim = true">Simulator</div>
    </div>
    <div class="ton-balance">
      <div class="amount-text">{{ currencyAmount(tonBalance) }}</div>
      <div class="text">Available in wallet</div>
    </div>
    <div class="button-container">
      <button class="button-stake" @click="selectFunction('stake')">
        Stake
      </button>
      <div>
        <div>
          <button class="button-stake" :class="{'model-btn-notavailable' : parseInt(operator.userStaked) === 0 && operator.withdrawalRequests.length !== 0}" :disabled="parseInt(operator.userStaked) === 0 && operator.withdrawalRequests.length !== 0" @click="selectFunction('unstake')">Unstake</button>
        </div>
      </div>

      <div>
        <button class="button-stake" :class="{'model-btn-notavailable' : operator.withdrawalRequests.length === 0}" :disabled="operator.withdrawalRequests.length === 0" @click="selectFunction('restake')">Re-stake</button>
      </div>

      <button class="button-stake" :class="{'model-btn-notavailable' : operator.userWithdrawable.isEqual(balance)}" :disabled="operator.userWithdrawable.isEqual(balance)" @click="selectFunction('withdraw')">Withdraw</button>
    </div>
    <transition v-if="showSim" name="model">
      <div class="model-mask">
        <div class="model-container">
          <simulator-modal
            @closePopup="closePopup"
            @openResultModal="openResultModal"
          />
        </div>
      </div>
    </transition>
    <transition v-if="showResultModal" name="model">
      <div class="model-mask-second">
        <div class="model-container">
          <simulator-result-modal
            :roi="roi"
            :rewardTON="rewardTON"
            :rewardUSD="rewardUSD"
            :rewardKRW="rewardKRW"
            :myStaked="myStaked"
            @closeModal="closeModal"
            @openStake="openStake"
          />
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
  components: {
    'simulator-modal': SimulatorModal,
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
      roi: 0,
      rewardTON: 0,
      rewardUSD: 0,
      rewardKRW: 0,
      myStaked: 0,
    };
  },
  computed: {
    ...mapState(['tonBalance']),
    ...mapGetters(['operatorByLayer2']),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    currencyAmount () {
      return (amount) =>
        this.$options.filters.currencyAmount(amount).slice(0, -4);
    },
  },
  methods: {
    selectFunction (method) {
      this.$emit('selectFunc', method);
    },
    closePopup () {
      this.showSim = false;
    },
    closeModal () {
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
    openStake () {
      this.showResultModal = false;
      this.showSim = false;
      this.$emit('openStakeModal', this.myStaked);
    },
  },
};
</script>``

<style scoped>
.staking-component-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border: solid 1px;
  border-color: #f4f6f8;
  border-radius: 10px;
  box-shadow: 0px 1px 2px 0px rgba(96, 97, 112, 0.2);
  padding: 15px 20px;
}
.sim {
  font-family: Roboto;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.82;
  letter-spacing: 0.28px;
  text-align: right;
  color: #2a72e5;
}
.sim-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 5px;
}
.ton-balance {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.amount-text {
  font-family: Roboto;
  font-size: 42px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: #2a72e5;
}
.button-container {
  margin-top: 30px;
 display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    /* width: 660px; */
    flex-flow: row wrap;
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
.model-mask-second {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 20%;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.6); */
  transition: opacity 0.3s ease;
}

.text {
  font-family: Roboto;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.38px;
  text-align: center;
  color: #808992;
  margin-top: 15px;
}
.model-container {
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 150px;
}

.button-stake {
  height: 38px;
  width: 150px;
  border-radius: 4px;
  border: solid 1px #257eee;
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  box-shadow: none;
  margin-bottom: 12px;
  /* margin: 30px 51px 0 0; */
  /* padding: 10px 57px 9px; */
  /* border-radius: 4px; */
  background-color: #257eee;
  /* height: 100%; */
}
.model-btn-notavailable {
  background-color: #e9edf1;
  border: solid 1px #e9edf1;
  cursor: default;
}
</style>
