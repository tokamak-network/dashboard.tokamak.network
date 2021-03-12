<template>
  <div class="operator-container">
    <div class="operator-header">
      <avatar
        class="avatar"
        fullname="O P R"
        :image="filteredImgURL(operator.avatar)"
        :size="50"
        :color="operator.color"
      />
      <div class="operator-name">{{ operator.name }}</div>
      <div>{{ operator.totalDeposit | currencyAmount }}</div>
      <div>
        {{ operator.isCommissionRateNegative ? "-" : ""
        }}{{ rateOf(operator.commissionRate) }}
      </div>

      <sticker v-if="operator.isCandidate" :title="'Candidate'" />
      <sticker :title="'Operator'" />

      <img
        :class="{ 'arrow-down': !pressed, 'arrow-up': pressed }"
        src="@/assets/images/arrow-unfolded.png"
        @click="openStaking()"
      >
    </div>
    <div
      v-if="pressed && selectedOperator === operator.layer2"
      class="operator-details"
    >
      <div class="row">
        <div class="column">
          <operator-text-view :title="'Total Delegates'" :value="'100'" />
          <operator-text-view :title="'Withdraw processed'" :value="'0 TON'" />
        </div>
        <div class="column">
          <staking-component :layer2="operator.layer2" @selectFunc="selectFunc" @openStakeModal="openStakeModal"/>
        </div>
        <div class="column">
          <operator-text-view :title="'Recent Commit'" :value="date" />

          <operator-text-view
            :title="'Commit Count'"
            :value="operator.finalizeCount"
          />
        </div>
      </div>
      <div class="row">
        <div class="column">
          Staking
          <div>
            <history-table :layer2="layer2" />
          </div>
        </div>
        <div class="column">
          Commit
          <div>
            <history-table :layer2="layer2" />
          </div>
        </div>
      </div>
      <transition v-if="showStake" name="model">
        <div class="model-mask">
          <div class="model-container">
            <stake-modal :layer2="operator.layer2" :amount="stakeAmount" @closePopup="closePopup" />
          </div>
        </div>
      </transition>
      <transition v-if="showRestake" name="model">
        <div class="model-mask">
          <div class="model-container">
            <restake-modal :layer2="operator.layer2" @closePopup="closePopup" />
          </div>
        </div>
      </transition>
      <transition v-if="showUnstake" name="model">
        <div class="model-mask">
          <div class="model-container">
            <unstake-modal :layer2="operator.layer2" @closePopup="closePopup" />
          </div>
        </div>
      </transition>
      <transition v-if="showWithdraw" name="model">
        <div class="model-mask">
          <div class="model-container">
            <withdraw-modal :layer2="operator.layer2" @closePopup="closePopup" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getConfig } from '../../config.js';
import moment from 'moment';
import OperatorTextView from '../components/OperatorTextView';
import StakingComponent from '../components/StakingComponent';
import HistroyTable from '../components/table/HistoryTable';
import StakeModel from '../components/StakeModel';
import RestakeModal from '../components/RestakeModal';
import UnstakeModal from '../components/UnstakeModal';
import WithdrawModal from '../components/WithdrawModal';
import Sticker from '../components/Sticker';
import Avatar from 'vue-avatar-component';
export default {
  components: {
    avatar: Avatar,
    'operator-text-view': OperatorTextView,
    'staking-component': StakingComponent,
    'history-table' : HistroyTable,
    'stake-modal': StakeModel,
    'restake-modal': RestakeModal,
    'unstake-modal' : UnstakeModal,
    'withdraw-modal': WithdrawModal,
    'sticker': Sticker,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      pressed: false,
      showStake:false,
      showUnstake:false,
      showRestake: false,
      showWithdraw: false,
      stakeAmount: '0',
    };
  },
  computed: {
    ...mapState(['user', 'DepositManager', 'selectedOperator']),
    ...mapGetters(['operatorByLayer2', 'transactionsByOperator']),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    filteredImgURL () {
      return (name) =>
        name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
    },
    transactions (){
      return this.transactionsByOperator(this.layer2);
    },
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    fromNow () {
      return (timestamp, suffix = false) =>
        this.$options.filters.fromNow(timestamp, suffix);
    },
    rateOf () {
      return (commissionRate) => this.$options.filters.rateOf(commissionRate);
    },
    date () {
      const zone = moment().utcOffset(this.operator.lastFinalizedAt);
      return moment
        .unix(this.operator.lastFinalizedAt)
        .format('YYYY.MM.DD HH:mm:ss (Z)');
    },
  },
  methods: {
    openStaking () {
      if (this.pressed) {
        this.pressed = false;
        this.$store.dispatch('setSelectedOperator', '');
      } else {
        this.pressed = true;
        this.$store.dispatch('setSelectedOperator', this.operator.layer2);
      }
    },
    viewDetailedOperator (operator) {
      const layer2 = operator.layer2;
      this.$router
        .push({
          path: `/staking/${layer2.toLowerCase()}`,
          query: { network: this.$route.query.network },
        })
        .catch((err) => {});
    },
    selectFunc (method) {
      if (method === 'stake') {
        this.showStake = true;
      }
      else if (method === 'unstake') {
        this.showUnstake = true;
      }
      else if (method === 'restake') {
        this.showRestake = true;
      }
      else if (method === 'withdraw') {
        this.showWithdraw = true;
      }
    },
    openStakeModal (amount){
      this.stakeAmount = amount;
      this.showStake = true;
    },
    closePopup (method) {
      if (method === 'stake') {
        this.showStake = false;
      }
      else if (method === 'unstake') {
        this.showUnstake = false;
      }
      else if (method === 'restake') {
        this.showRestake = false;
      }
      else if (method === 'withdraw') {
        this.showWithdraw = false;
      }
    },
  },
};
</script>

<style scoped>
.operator-container {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  background-color: #e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
  margin-bottom: 19px;
}
.operator-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.arrow-down {
  transform: rotate(180deg);
}
.arrow-up {
  transform: rotate(0deg);
}
.arrow-up:hover,
.arrow-down:hover {
  cursor: pointer;
}

.operator-details {
  display: flex;
  flex-direction: column;
}
.operator-name {
  font-size: 20px;
  /* font-weight: 700; */
  margin-left: 10px;
  padding: 10px;
}
.avatar {
  margin-top: -5px;
}
.column {
  display: flex;
  flex-direction: column;
  margin: 20px;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* margin: 20px; */
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
    margin-top: 150px;
}
</style>
