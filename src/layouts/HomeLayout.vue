<template>
  <div>
    <div v-if="loaded" class="home-layout">
      <div class="home-content">
        <div class="home-stats">
          <div>
            <div class="home-stats__title">There is currently</div>
            <div class="home-stats__amount">
              {{
                totalStaked.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              }}
              TON
            </div>
            <div class="home-stats__description">Staked in the</div>
            <div class="home-stats__tokamak">Tokamak Network</div>
          </div>
          <div class="home-stats__chart" style="position: relative; height:45vh; width:98.99vw; margin-bottom: 3rem;">
            <div class="legend-container">
              <div class="legend" />
              <div :style="'margin-right:20px;'">Total Stake</div>
              <div class="legend" style="background-color:#C7D1D8" />
              <div>Actual APY</div>
            </div>
            <GraphContainer v-if="dailyTotalStaked" :dailyStakedTotal="dailyTotalStaked" />
          </div>
          <div class="home-footer">
            <div class="footer-items">
              <div class="footer-items__card">
                <div class="items-card__title">
                  Round
                  <span class="items-card__title-span">start</span>
                </div>
                <span class="items-card__text">{{ formatTimeString(currentRound.startTime) }}
                </span>
                <span class="items-card__subtext">{{ formatTimeSeconds(currentRound.startTime) }}
                </span>
                <span class="items-card__subtext">(GMT {{ timezone(currentRound.startTime) }})
                </span>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">
                  PowerTON
                  <span class="items-card__title-span">Reward</span>
                </div>
                <span class="items-card__text">{{
                  currencyAmount(
                    currentRound.reward.add(uncommittedCurrentRoundReward)
                  )
                }}</span>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">
                  Round
                  <span class="items-card__title-span">End</span>
                </div>
                <div class="items-card__text">
                  {{ durationTime.days() + "D "+ durationTime.hours()+ ":"+ durationTime.minutes()+ ":"+ durationTime.seconds() }}
                  <span class="items-card__subtext">{{ date }}</span>
                  <span class="items-card__subtext">(GMT {{ timezone(currentRound.endTime) }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import GraphContainer from '@/containers/GraphContainer.vue';
import moment from 'moment';

export default {
  components: {
    GraphContainer,
  },
  data () {
    return {
      durationTime: moment.duration(0),
      dailyStaked: this.dailyTotalStaked,
      maxCompensateTokenPerDay: '26027.39726',
      pSeigDeduction: '40',
      totalSupply: 40000000,
    };
  },
  computed: {
    ...mapState([
      'currentRound',
      'uncommittedCurrentRoundReward',
      'loaded',
      'totalStaked',
      'dailyTotalStaked',
    ]),
    ...mapGetters(['userTotalStaked', 'userTotalSeigs']),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    formatTimeString () {
      return (timestamp) => this.$options.filters.formatTimeString(timestamp);
    },
    formatTimeSeconds () {
      return (timestamp) => this.$options.filters.formatTimeSeconds(timestamp);
    },
    timezone () {
      return (timestamp) => this.$options.filters.timezone(timestamp);
    },
    date () {
      return moment.unix(this.currentRound.endTime).format('MM.DD HH:mm ');
    },
  },
  created () {
    setInterval(()=> this.calcDuration(), 1000);
  },
  methods: {
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
.home-layout {
  display: flex;
  justify-content: center;
  background-color: #fafbfc;
  margin-top: 80px;
}
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.home-stats {
  display: flex;
  flex-direction: column;
  background-image: url('../assets/images/map.png');
}

.home-stats__title {
  margin-bottom: 25px;
  font-family: "Titillium Web", sans-serif;
  font-size: 38px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  line-height: 0.47;
}

.home-stats__amount {
  margin-bottom: 30px;
  font-family: "Titillium Web", sans-serif;
  font-size: 50px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 1.25px;
  text-align: center;
  color: #2a72e5;
}

.home-stats__description {
  font-family: "Titillium Web", sans-serif;
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  line-height: 1.88;
}

.home-stats__tokamak {
  font-family: "NanumSquare", sans-serif;
  font-size: 38px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.58;
  letter-spacing: normal;
  text-align: center;
  color: #3d495d;
  margin-bottom: 30px;
}

.home-stats__chart {
  width: 100%;
}

.home-stats__amount small {
  font-weight: 800;
  margin: 0;
}

.legend-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Titillium Web", sans-serif;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.26px;
  text-align: left;
  color: #84919e;
}

.legend {
  height: 2px;
  width: 15px;
  background: #2a72e5;
  margin-right: 10px;
}

.home-body__balance {
  text-align: center;
}

.home-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.footer-items {
  display: grid;
  margin-top: 49px;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 80px;
}

.footer-items__card {
  text-align: center;
  width:250px;
}

.items-card__title {
  font-family: "Titillium Web", sans-serif;
  font-size: 15px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.26px;
  color: #3d495d;
}

.items-card__title-span {
  font-family: "Titillium Web", sans-serif;
  font-size: 15px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 0.26px;
  text-align: left;
  color: #0060c7;
}

.items-card__text {
  font-family: "Titillium Web", sans-serif;
  font-size: 22px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.89;
  letter-spacing: normal;
  text-align: right;
  color: #3d495d;
}
.items-card__subtext {
  font-family: "Titillium Web", sans-serif;
  font-size: 11px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.89;
  letter-spacing: normal;
  text-align: right;
  color: #3d495d;
}
</style>
