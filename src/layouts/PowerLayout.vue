<template>
  <div class="power-layout">
    <div class="power-title-container">
      <h1>PowerTON</h1>
      <h2>Be a winner of our Power TON game by staking TON.</h2>
    </div>
    <div class="power-current">
      <div class="power-current-detail">
        <h3>Round</h3>
        <span class="power-current-detail-content">{{ currentRound.index }}</span>
      </div>
      <div class="power-current-detail">
        <h3>Round Reward</h3>
        <span class="power-current-detail-content">{{ currencyAmount(
          currentRound.reward.add(uncommittedCurrentRoundReward)
        ) }}</span>
      </div>
      <div class="power-current-detail">
        <h3>24 Hour</h3>
        <span class="power-current-detail-content">{{ currentRound.index }}</span>
      </div>
      <div class="power-current-detail">
        <h3>Round Start</h3>
        <span class="power-current-detail-content">{{ formattedTimestamp(currentRound.startTime) }} <span class="power-current-detail-gmt">(GMT+9)</span></span>
      </div>
    </div>
    <div class="power-current-display">
      <h2>Round End</h2>
      <h1>{{ formmatedEndTime(currentRound.endTime) }}</h1>
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
export default {
  components: {
    PowerTonTable,
  },
  data () {
    return {
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
  methods: {
    formattedTimestamp (timestamp) {
      const format1 = 'YYYY-MM-DD HH:mm:ss';
      return moment.unix(timestamp).format('YYYY.MM.DD. hh:mm:ss');
    },
    formmatedEndTime (timestamp) {
      const endDay = {
        year : moment.unix(timestamp).format('YYYY'),
        month : moment.unix(timestamp).format('MM'),
        day : moment.unix(timestamp).format('DD'),
        hour : moment.unix(timestamp).format('hh'),
        minute : moment.unix(timestamp).format('mm'),
        second :moment.unix(timestamp).format('ss'),
      };

      const today = {
        year : moment().format('YYYY'),
        month: moment().format('MM'),
        day: moment().format('DD'),
        hour : moment().format('hh'),
        minute : moment().format('mm'),
        second :moment().format('ss'),
      };

      const trimedEndDay = moment([endDay.year, endDay.month, endDay.day, endDay.hour, endDay.minute, endDay.second]);
      const trimedToday = moment([today.year, today.month, today.day, today.hour, today.minute, today.second]);

      const dayGap = trimedEndDay.diff(trimedToday, 'days');
      const hourGap = trimedEndDay.diff(trimedToday, 'hours');
      const minGap = trimedEndDay.diff(trimedToday, 'minutes');
      const secGap = trimedEndDay.diff(trimedToday, 'seconds');

      const trimedHourGap = hourGap % 24;
      const triemdMinGap = (minGap % 1440) - (trimedHourGap * 60);
      const triemdSecGap = (secGap % 86400) % 60;

      this.day = dayGap;
      this.hour = trimedHourGap < 10 ? `0${trimedHourGap}`: trimedHourGap;
      this.minute = triemdMinGap < 10 ? `0${triemdMinGap}`: triemdMinGap;
      this.second = triemdSecGap < 10 ? `0${triemdSecGap}`: triemdSecGap;

      return `${this.day}D ${this.hour}:${this.minute}:${this.second}`;
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
  font-size: 36px;
  color: #3d495d;
  font-weight: 700;
  margin-bottom: 15px;
}
.power-title-container h2 {
  font-size: 16px;
  color: #808992;
  font-weight: normal;
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
  font-size: 13px;
  color: #808992;
  font-weight: 500;
  margin-bottom: 7px;
}
.power-current-detail-content {
  font-size: 20px;
  font-weight: 500;
  color: #304156;
  font-family: Roboto;
}
.power-current-detail-gmt {
  font-size: 12px;
  color: #808992;
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

