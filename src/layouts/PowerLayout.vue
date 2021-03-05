<template>
  <div class="power-layout">
    <div class="power-content">
      <h1>PowerTON</h1>
      <div class="power-current">
        <!-- <div>{{ currentRound }}</div> -->
        <div class="power-current-text">
          <span>Round</span>
          <span>{{ currentRound.index }}</span>
        </div>
        <div class="power-current-text">
          <span>Round Reward</span>
          <span>{{ currentRound.reward }}</span>
        </div>
        <div class="power-current-text">
          <span>24H</span>
          <span>Round</span>
        </div>
        <div class="power-current-text">
          <span>Round Start</span>
          <span>{{ formattedTimestamp(currentRound.endTime) }}</span>
        </div>
      </div>
      <div class="power-current-display">
        <h2>Round End</h2>
        <span>3D 2:20:30</span>
        <span>{{ formattedTimestamp(currentRound.endTime) }}</span>
      </div>
      <PowerTonLayout />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import PowerTonLayout from './PowerTONLayout';
import moment from 'moment';

export default {
  components: {
    PowerTonLayout,
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
    formattedTimestamp (timestamp) {
      return moment.unix(timestamp).format('LLL');
    },
  },
};
</script>
<style scoped>
.power-layout {
  display: flex;
}
.power-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.power-current {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.power-current-text {
  display: flex;
  flex-direction: column;
}
.power-current-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

</style>
