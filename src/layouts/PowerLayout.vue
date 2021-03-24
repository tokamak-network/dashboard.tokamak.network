<template>
  <div class="power-layout">
    <div class="power-title-container">
      <h1>PowerTON</h1>
      <h2>Be a winner of our Power TON game by staking TON.</h2>
    </div>
    <div class="power-current">
      <ValueView :title="'Round'" :value="currentRound.index" :ton="false" />
      <ValueView :title="'Round Reward'" :value="currencyAmount(currentRound.reward.add(uncommittedCurrentRoundReward)).toString().replace('TON', '')" :ton="true" />
      <ValueView :title="'24 Hour'" :value="currentRound.index" :ton="false" />
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
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
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
    // formmatedEndTime (timestamp) {
    //   const endDay = {
    //     year : moment.unix(timestamp).format('YYYY'),
    //     month : moment.unix(timestamp).format('MM'),
    //     day : moment.unix(timestamp).format('DD'),
    //     hour : moment.unix(timestamp).format('hh'),
    //     minute : moment.unix(timestamp).format('mm'),
    //     second :moment.unix(timestamp).format('ss'),
    //   };

    //   const today = {
    //     year : moment().format('YYYY'),
    //     month: moment().format('MM'),
    //     day: moment().format('DD'),
    //     hour : moment().format('hh'),
    //     minute : moment().format('mm'),
    //     second :moment().format('ss'),
    //   };

    //   const trimedEndDay = moment([endDay.year, endDay.month, endDay.day, endDay.hour, endDay.minute, endDay.second]);
    //   const trimedToday = moment([today.year, today.month, today.day, today.hour, today.minute, today.second]);

    //   const dayGap = trimedEndDay.diff(trimedToday, 'days');
    //   const hourGap = trimedEndDay.diff(trimedToday, 'hours');
    //   const minGap = trimedEndDay.diff(trimedToday, 'minutes');
    //   const secGap = trimedEndDay.diff(trimedToday, 'seconds');

    //   const trimedHourGap = hourGap % 24;
    //   const triemdMinGap = (minGap % 1440) - (trimedHourGap * 60);
    //   const triemdSecGap = (secGap % 86400) % 60;

    //   this.day = dayGap;
    //   this.hour = trimedHourGap < 10 ? `0${trimedHourGap}`: trimedHourGap;
    //   this.minute = triemdMinGap < 10 ? `0${triemdMinGap}`: triemdMinGap;
    //   this.second = triemdSecGap < 10 ? `0${triemdSecGap}`: triemdSecGap;

    //   return `${this.day}D ${this.hour}:${this.minute}:${this.second}`;
    // },
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

