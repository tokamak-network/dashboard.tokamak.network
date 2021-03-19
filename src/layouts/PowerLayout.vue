<template>
  <div class="power-layout">
    <div class="power-title-container" @click="test">
      <h1>PowerTON</h1>
      <h2>Be a winner of our Power TON game by staking TON.</h2>
    </div>
    <div class="power-current">
      <div class="power-current-detail">
        <h3>Round</h3>
        <span>{{ currentRound.index }}</span>
      </div>
      <div class="power-current-detail">
        <h3>Round Reward</h3>
        <span>{{ currentRound.reward | currencyAmount }}</span>
      </div>
      <div class="power-current-detail">
        <h3>24 Hour</h3>
        <span>{{ currentRound.index }}</span>
      </div>
      <div class="power-current-detail">
        <h3>Round Start</h3>
        <span>{{ formattedTimestamp(currentRound.startTime) }}</span>
      </div>
    </div>
    <div class="power-current-display">
      <h2>Round End</h2>
      <h1>3D 02:20:30</h1>
      <h3>
        {{ formattedTimestamp(currentRound.endTime) }}
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
  computed: {
    ...mapState([
      'user',
      'power',
      'currentRound',
      'rounds',
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
  },
  methods: {
    test () {
      console.log(this.currentRound);
    },
    formattedTimestamp (timestamp) {
      return moment.unix(timestamp).format('LLL');
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
  height: 84px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(96, 97, 112, 0.16);
  border-radius: 10px;
  margin-left: 30px;
}
.power-current-detail h3 {
  font-size: 13px;
  color: #808992;
  font-weight: 500;
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

