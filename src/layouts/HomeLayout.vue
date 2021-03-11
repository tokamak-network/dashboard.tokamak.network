<template>
  <div>
    <div class="home-layout">
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
          <line-chart :chartData="data" :width="1024" :height="400" />
          <div v-if="loaded" class="home-footer">
            <div class="footer-items">
              <div class="footer-items__card">
                <div class="items-card__title">
                  Round
                  <span class="items-card__title-span">start</span>
                </div>
                <span class="items-card__date">{{ formattedTimestamp(currentRound.startTime) }}
                </span>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">
                  PowerTON
                  <span class="items-card__title-span">Reward</span>
                </div>
                <span class="items-card__date">{{
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
                <span>3D 2:20:30 </span>
                <div class="items-card__date">
                  {{ formattedTimestamp(currentRound.endTime) }}
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
// import SwapComponent from '@/components/SwapComponent.vue';
import { mapState, mapGetters } from 'vuex';
import LineChart from '@/components/LineChart.vue';
import moment from 'moment';

// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

// mock data
const datasets = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  datasets: [
    {
      label: '2018 Sales',
      borderColor: 'rgba(50, 115, 220, 0.5)',
      borderWidth: 2,
      lineTension: 0.1,
      backgroundColor: 'transparent',
      pointStyle: 'cross',
      data: [300, 700, 450, 750, 450, 300, 700, 450, 750, 450, 750, 450],
    },
    {
      label: '2017 Sales',
      borderColor: 'rgba(255, 56, 96, 0.5)',
      borderWidth: 2,
      lineTension: 0.1,
      backgroundColor: 'transparent',
      pointStyle: 'cross',
      data: [600, 550, 750, 250, 700, 600, 550, 750, 250, 700, 600, 550],
    },
  ],
};

export default {
  components: {
    // SwapComponent,
    LineChart,
  },
  data () {
    return {
      data: datasets,
    };
  },
  computed: {
    ...mapState([
      'user',
      'networkId',
      'tonBalance',
      'blockNumber',
      'power',
      'signIn',
      'currentRound',
      'uncommittedCurrentRoundReward',
      'loaded',
      'totalStaked',
    ]),
    ...mapGetters(['userTotalStaked', 'userTotalSeigs']),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    formattedTimestamp () {
      return (timestamp) => this.$options.filters.formattedTimestamp(timestamp);
    },
  },
  created () {},
  methods: {},
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
  width: 85vw;
}
.home-stats {
  display: flex;
  flex-direction: column;
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
  /* line-height: 1; */
  /* width: 284px; */
  /* height: 58px; */
  /* font-weight: 300; */
  /* letter-spacing: 2; */
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
  /* line-height: 0.36; */
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
.home-stats__amount small {
  font-weight: 800;
  margin: 0;
}

.home-body {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100vw;
  margin-top: 2rem;
}

.home-body__stats {
  display: flex;
  justify-content: space-between;
  width: 40vw;
}

.home-body__balance {
  text-align: center;
}

.home-footer {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.footer-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1rem;
}

.footer-items__card {
  /* border-radius: 1rem;
  border: 1px solid #d4d3d3; */
  /* padding: 1rem 2rem; */
}

.items-card__title {
  font-family: "Titillium Web", sans-serif;
  font-size: 13px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  /* line-height: 1.54; */
  letter-spacing: 0.26px;
  text-align: left;
  color: #3d495d;
}
.items-card__title-span {
  font-family: "Titillium Web", sans-serif;
  font-size: 13px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  /* line-height: 1.54; */
  letter-spacing: 0.26px;
  text-align: left;
  color: #0060c7;
}
.items-card__date {
  font-family: "Titillium Web", sans-serif;
  font-size: 18px;

  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.89;
  letter-spacing: normal;
  text-align: right;
  color: #3d495d;
}
</style>
