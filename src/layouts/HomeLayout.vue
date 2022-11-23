<template>
  <div class="home-wrapper">
    <div v-if="loaded" class="home-layout">
      <div class="home-content">
        <div class="home-stats">
          <div class="home-stats-container">
            <div class="home-stats__title">There is currently</div>
            <RollingNumber :totalSupply="totalStaked" />
            <!-- <div class="home-stats__amount">
              {{
                totalStaked.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              }}
              TON
            </div> -->
            <div class="home-stats__description">Staked in the</div>
            <div class="home-stats__tokamak">Tokamak Network</div>
          </div>
          <div
            class="home-stats__chart"
            style="position: relative; height:25vh;"
          >
            <div class="legend-container">
              <div class="legend" />
              <div :style="'margin-right:20px;'">Total Stake</div>
              <div class="legend" style="background-color:#C7D1D8" />
              <div>Actual APY</div>
            </div>
            <GraphContainer
              v-if="dailyTotalStaked"
              :dailyStakedTotal="dailyTotalStaked"
              :totalSupply="totalStaked"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _WTON = createCurrency('TON');
import GraphContainer from '@/containers/GraphContainer.vue';
import RollingNumber from '@/components/RollingNumber.vue';

export default {
  components: {
    GraphContainer,
    RollingNumber,
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
      'loaded',
      'totalStaked',
      'dailyTotalStaked',
      'currentPowerRound',
      'powerReward',
    ]),
    // ...mapGetters(['userTotalStaked', 'userTotalSeigs']),
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
    reward () {
      return this.currencyAmount(
        _WTON(this.powerReward[0].rewards.toString(), 'ray')
      );
    },
    date () {
      return moment
        .unix(this.currentPowerRound.data.endTime)
        .format('MM.DD HH:mm ');
    },
  },
  created () {
    setInterval(() => this.calcDuration(), 1000);
  },
  methods: {
    calcDuration () {
      const now = moment().unix();
      const endTime = this.currentPowerRound.data.endTime;
      const leftTime = endTime - now;
      const duration = moment.duration(leftTime * 1000, 'milliseconds');
      this.durationTime = duration;
    },
  },
};
</script>
<style scoped>
.home-wrapper {
  width: 100%;
}
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
  width: 100%;
  background-image: url("../assets/images/map.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
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
  width: 260px;
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
.home-stats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
