<template>
  <div class="operator-container">
    <div class="operator-header" @click="openStaking()">
      <div class="header-column">
        <div>
          <dot v-if="operator.isCandidate" :title="'DAO'" style="margin-bottom:4px; margin-left:16px" />
          <dot v-if="operator.isOperator" :title="'Operator'" style="margin-left:16px" />
        </div>
        <avatar
          class="avatar"
          fullname="O P R"
          :image="filteredImgURL(operator.avatar)"
          :size="48"
        />
        <div class="operator-name">{{ operator.name }}</div>
        <div class="operator-amount">Total Staked</div>
        <div class="operator-amount" style="width:139px"> {{ currencyAmount(operator.totalStaked) }}</div>
        <div v-if="signIn" class="operator-amount">Commission Rate</div>
        <div v-if="signIn" class="operator-amount" style="width:37px; margin-right:50px">
          {{ operator.isCommissionRateNegative ? "-" : ""
          }}{{ rateOf(operator.commissionRate) }}
        </div>
        <div v-if="signIn">
          <div v-if="Number(operator.userStaked.toBigNumber())" class="user-staked">
            <div class="operator-amount">Your Staked</div>
            <div class="operator-amount" style="width:139px"> {{ currencyAmount(operator.userStaked) }}</div>
          </div>
        </div>
      </div>
      <img class="arrow"
           :class="{ 'arrow-up': !isPressed, 'arrow-down': isPressed }"
           src="@/assets/images/arrow_open_icon.png"
      >
    </div>
    <div
      v-if="isPressed"
      class="operator-details"
    >
      <div class="divider" />
      <div class="row">
        <div class="column" style="margin-top:30px">
          <operator-text-view :title="'Total Delegates'" :value="operator.delegators.length.toString()" :date="false" :tonValue="false" />
          <operator-text-view :title="'Pending Withdrawal'" :value="showAmount" :date="false" :tonValue="signIn?true:false" style="margin-top:40px" />
        </div>
        <div class="column">
          <staking-component :layer2="operator.layer2" @selectFunc="selectFunc" @openStakeModal="openStakeModal" />
        </div>
        <div class="column" style="margin-top:30px">
          <operator-text-view :title="'Recent Commit'" :value="date" :date="true" :tonValue="false" />

          <operator-text-view
            :title="'Commit Count'"
            :value="operator.finalizeCount"
            :date="false"
            :tonValue="false"
            style="margin-top:40px"
          />
        </div>
      </div>
      <div class="row">
        <div class="column" style="margin-right:30px; width: 870px">
          <div class="table-header">
            <div class="title">Staking History</div>
            <div class="tx-toggle">
              {{ !toggled? 'My Transactions': 'All transactions' }}
              <toggle-button v-model="toggled" :disabled="!signIn" :color="{checked: '#36af47', unchecked: '#2a72e5', disabled: '#e9edf1'}" :height="16" :width="36" />
            </div>
          </div>
          <user-history-table v-if="!toggled" :layer2="layer2" />
          <operator-user-histroy-table v-else :operatorHistroy="operator.operatorsHistory" />
        </div>
        <div class="column">
          <div class="title">Commit History</div>

          <commit-table :commitHistory="operator.commitHistory" />
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
import UserHistroyTable from '../components/table/UserHistoryTable';
import OperatorUserHistroyTable from '../components/table/OperatorUserHistoryTable';
import StakeModel from '../components/StakeModel';
import RestakeModal from '../components/RestakeModal';
import UnstakeModal from '../components/UnstakeModal';
import WithdrawModal from '../components/WithdrawModal';
import CommitTable from '../components/table/CommitTable';
import Dot from '../components/Dot';
import Avatar from '../components/Avatar';
export default {
  components: {
    avatar: Avatar,
    'operator-text-view': OperatorTextView,
    'staking-component': StakingComponent,
    'user-history-table' : UserHistroyTable,
    'operator-user-histroy-table' :OperatorUserHistroyTable,
    'commit-table' :CommitTable,
    'stake-modal': StakeModel,
    'restake-modal': RestakeModal,
    'unstake-modal' : UnstakeModal,
    'withdraw-modal': WithdrawModal,
    'dot':Dot,
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
      selectedOp: '',
      toggled: true,

    };
  },
  computed: {
    ...mapState(['user', 'DepositManager', 'selectedOperator', 'signIn']),
    ...mapGetters(['operatorByLayer2', 'transactionsByOperator']),
    operator () {
      // console.log(this.operatorByLayer2(this.layer2));
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
      console.log(this.operator);
      if(this.operator.finalizeCount !== '0') {
        const zone = moment().utcOffset(this.operator.lastFinalizedAt);
        return moment
          .unix(this.operator.lastFinalizedAt)
          .format('YYYY.MM.DD HH:mm:ss (Z)');
      }
      else {
        return 'The operator does not have any commits';
      }
    },
    isPressed () {
      if (this.selectedOperator === this.operator.layer2) {
        return true;
      }
      else {
        return false;
      }
    },
    showAmount () {
      return this.signIn? this.currencyAmount(this.operator.pendingUnstakedLayer2).toString().replace('TON', ''): '-' ;

    },
  },
  mounted () {
    this.selectedOp = this.selectedOperator;
  },
  methods: {
    openStaking () {

      if (this.isPressed) {
        this.$store.dispatch('setSelectedOperator', '');
      }
      else {
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
  width: 1100px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 1px 0 rgba(96, 97, 112, 0.16);
  margin-bottom: 12px;
}
.operator-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.header-column {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.operator-amount {
  display: flex;
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: left;
  color: #86929d;
  margin-right: 10px;
}
.arrow {
  margin-right: 20px;
  display: flex;
  justify-content: flex-end;
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

.user-staked {
  display: flex;
  flex-directio: row;
}
.divider {
  width: 100%;
  height: 1px;
  margin-bottom: 60px;
  background-color: #f4f6f8;
}
.operator-details {
  display: flex;
  flex-direction: column;
}
.operator-name {
  margin-left: 12px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
  width: 200px;
  margin-right: 60px;
}
.avatar {
  margin:13px 0px 13px 3px;
}
.column {
  display: flex;
  flex-direction: column;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 70px;
  margin-bottom: 60px;
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
.model-leave-active {
  opacity: 0;
}
.model-container {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100%;
  transition: all 0.3s ease;

}
.model-enter .model-container,
.model-leave-active .model-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.title {
  font-family: Roboto;
  font-size: 15px;
  font-weight: bolder;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.38px;
  text-align: left;
  color: #3d495d;
  margin-bottom: 5px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  padding: 0;
}
.tx-toggle {
  font-family: Roboto;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.82;
  letter-spacing: 0.28px;
  text-align: right;
  color: #828d99;
  margin-right: 7px;
}
</style>
