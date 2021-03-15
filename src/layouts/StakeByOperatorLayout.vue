<template>
  <div class="staking-layout">
    <div class="staking-content">
      <div>Operator Details</div>
      <div class="row">
        <div>{{ operator.name }}</div>
        <div>
          <button>stake</button>
        </div>
        <div>
          <button>Re-stake</button>
        </div>

        <div>
          <button>Unstake</button>
        </div>

        <div>
          <button>Withdraw</button>
        </div>
      </div>
      <div class="row">
        <div class="column">
          <div>Total staked</div>
          <div>{{ operator.totalDeposit | currencyAmount }}</div>
        </div>
        <div class="column">
          <div>Comission Rate</div>
          <div>{{ operator.isCommissionRateNegative ? '-' : '' }}{{ rateOf(operator.commissionRate) }}</div>
        </div>
        <div class="column">
          <div>Recent Commit</div>
          <div>{{ date }}</div>
        </div>
        <div class="column">
          <div>Total staked</div>
          <div>Total staked</div>
        </div>
        <!-- <div class="staking-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <div class="page-header">Stake tokens now!!</div>
      <div class="page-text">Stake TON to earn TON</div>
      <div class="balance-container">
        <StakeByOperatorComponent :layer2="layer2" />
      </div>
    </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { getConfig } from '../../config.js';
import moment from 'moment';
// import StakeByOperatorComponent from '@/components/StakeByOperatorComponent.vue';
export default {
  components: {
    // StakeByOperatorComponent,
  },
  data () {
    return {
      layer2: '',
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
    ...mapGetters(['operatorByLayer2']),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    filteredImgURL () {
      return (name) =>
        name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
    },
    rateOf () {
      return (commissionRate) => this.$options.filters.rateOf(commissionRate);
    },
    // delete
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    minimumAmount () {
      return this.SeigManager.methods.minimumAmount().call();
    },
    date () {
      const zone = moment().zone(this.operator.lastFinalizedAt);
      return moment.unix(this.operator.lastFinalizedAt).format('YYYY.MM.DD HH:mm:ss (Z)') ;
    },
    operatorMinimumAmount () {
      const operatorDeposit = this.operator.selfDeposit;
      const minimumAmount = this.operator.minimumAmount;
      const lessThan = operatorDeposit < minimumAmount;
      if (this.user !== this.operator.address) {
        return lessThan;
      } else {
        return false;
      }
    },
  },
  created () {
    this.layer2 = this.$route.params.layer2;
  },
};
</script>
<style scoped>
.staking-layout {
  min-width: 1174px;
  max-width: 1174px;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}
.staking-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 850px;
}
.row {
  display: flex;
  flex-direction: row;
}
.column {
    display: flex;
  flex-direction: column;
  margin-right: 10px;
}
.page-header {
  /* margin-top: 10px;
  margin-bottom: 15px; */
  font-family: cursive;
  color: #555555;
  font-size: 36px;
  text-align: center;
  font-weight: 700;
  padding: 0px;
}
.page-text {
  margin-bottom: 15px;
  color: #8c8c8c;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
}
.balance-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 660px;
}
</style>
