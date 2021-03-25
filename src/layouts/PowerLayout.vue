<template>
  <div class="power-layout">
    <div class="power-title-container">
      <h1>PowerTON</h1>
      <h2>Be a winner of our Power TON game by staking TON.</h2>
    </div>
    <div class="power-current">
      <ValueView :title="'Round'" :value="currentRound.index" :ton="false" />
      <ValueView :title="'Round Reward'" :value="currencyAmount(currentRound.reward.add(uncommittedCurrentRoundReward)).toString().replace('TON', '')" :ton="true" />
      <div class="power-current-detail">
        <h3>24 Hour</h3>
        <span class="power-current-detail-content">{{ powerTONReward.difference }} <span class="power-current-detail-percentage" :class="{'power-current-detail-percentage-positive':powerTONReward.isNegative === false, 'power-current-detail-percentage-negative':powerTONReward.isNegative === true}">{{ powerTONReward.percentage }}</span>
          <span v-if="powerTONReward.isNegative === true">
            <img src="@/assets/images/arrow_down_icon.png" style="margin-bottom: -3px;" alt="">
          </span>
          <span v-if="powerTONReward.isNegative === false">
            <img src="@/assets/images/arrow_up_icon.png" style="margin-bottom: -3px;" alt="">
          </span>
        </span>
      </div>
      <!-- <ValueView :title="'24 Hour'" :value="powerTONReward.percentage" :ton="false" /> -->
      <div class="power-current-detail">
        <h3>Round Start</h3>
        <span class="power-current-detail-content">{{ formattedTimestamp(currentRound.startTime) }} <span class="power-current-detail-gmt">(GMT+9)</span></span>
      </div>
    </div>
    <div class="power-current-display">
      <h2>Round End</h2>
      <h1>{{ durationTime.days() + "D "+ durationTime.hours()+ ":"+ durationTime.minutes()+ ":"+ durationTime.seconds() }}</h1>
      <h3>
        {{ formattedTimestamp(currentRound.endTime) }} (GMT+9)
      </h3>
    </div>
    <PowerTonTable />
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';
import PowerTonTable from '@/components/PowerTonTable.vue';
import ValueView from '@/components/ValueView.vue';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

export default {
  components: {
    PowerTonTable,
    ValueView,
  },
  data () {
    return {
      durationTime: moment.duration(0),
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };
  },
  computed: {
    ...mapState([
      'user',
      'power',
      'currentRound',
      'rounds',
      'uncommittedCurrentRoundReward',
      'powerReward',
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    powerTONReward () {
      const reward = {};
      const ton = Number((this.powerReward[0].rewards - this.powerReward[1].rewards)/Math.pow(10, 27));
      // const ton = Number((this.powerReward[1].rewards - this.powerReward[0].rewards)/Math.pow(10, 27));
      const index = ton.toString().indexOf('.');
      const rewardInTON = index > -1 ? ton.toLocaleString('en-US', { minimumFractionDigits: 2 }).slice(0, index + 4): ton;
      const percentage = (this.powerReward[0].rewards - this.powerReward[1].rewards)/this.powerReward[1].rewards;
      // const percentage = (this.powerReward[1].rewards - this.powerReward[0].rewards)/this.powerReward[1].rewards;
      const isNegative = ton < 0? true : ton === 0 ? '': false;
      reward.difference = rewardInTON;
      reward.percentage = percentage.toFixed(2).toString() + '%';
      reward.isNegative = isNegative;
      return reward;
    },
  },
  mounted () {
    this.second = setInterval(() => {
      this.second = this.second -1;
    }, 1000);
  },
  created () {
    setInterval(()=> this.calcDuration(), 1000);
  },
  methods: {
    formattedTimestamp (timestamp) {
      const format1 = 'YYYY-MM-DD HH:mm:ss';
      return moment.unix(timestamp).format('YYYY.M.D. HH:mm:ss');
    },
    calcDuration () {
      const now = moment().unix();
      const endTime = this.currentRound.endTime;
      const leftTime = endTime - now;
      const duration = moment.duration(leftTime*1000, 'milliseconds');
      this.durationTime = duration;
    },
  },
};
</script>
<style scoped>
.power-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 70px;
}
.power-title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.power-title-container h1 {
font-family: "NanumSquare", sans-serif;
  font-size: 38px;
font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  margin-bottom: 15px;
}
.power-title-container h2 {
font-family: "Titillium Web", sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.4px;
  text-align: center;
  color: #808992;
  margin-bottom: 60px;
}
.power-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 130px;
}
.power-current-detail {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 51px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(96, 97, 112, 0.16);
  border-radius: 10px;
  margin-left: 30px;
  padding-top: 18px;
  padding-bottom: 15px;
}
.power-current-detail h3 {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: center;
  color: #808992;
  margin-bottom: 7px;
}
.power-current-detail-content {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: right;
  color: #304156;
}
.power-current-detail-gmt {
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #94a5b7;
}
.power-current-detail-percentage {
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: right;
}
.power-current-detail-percentage-positive {
  color: #ff2d78;
}
.power-current-detail-percentage-negative {
  color: #45d800;
}
.power-current-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 137px;
}
.power-current-display h2 {
  font-size: 30px;
  color: #3d495d;
  font-weight: 600;
  font-family: "Titillium Web", sans-serif;
  margin: 0;
}
.power-current-display h1 {
  font-size: 65px;
  font-weight: 600;
  color: #2a72e5;
  margin: 0;
}
.power-current-display h3 {
  font-size: 16px;
  font-weight: normal;
  color: #94a5b7;
  margin: 0;
}
</style>

