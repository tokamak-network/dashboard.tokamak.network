<template>
  <div>
    <div v-if="signIn" class="home-layout">
      <div class="home-content">
        <img class="logo" alt="Tokamak Logo" src="@/assets/images/TokamakLogo.png">
        <div class="page-header">Stake tokens now!!</div>
        <div class="page-text">Stake your TON to earn Power TON and other rewards</div>
        <div class="balance-container">
          <div class="ton-balance">
            <SwapComponent
              title="Your TON Balance"
              :balance="tonBalance | currencyAmount"
              rewards="Power TON Balance"
              :value="currencyAmount(power)"
            />
          </div>
          <div class="ton-balance">
            <SwapComponent
              title="Total Staked Amount"
              :balance="currencyAmount(userTotalStaked)"
              rewards="Expected Rewards"
              :value="expectedRewards()"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="home-layout">
      <div class="home-content">
        <div class="home-stats">
          <div>
            <h4 class="home-stats__title">Total Staked</h4>
            <h4 class="home-stats__amount">1000 <small>TON</small></h4>
          </div>
          <line-chart
            :datasets="data"
            :width="500"
            :height="200"
          />
          <div class="home-footer">
            <div class="footer-items">
              <div class="footer-items__card">
                <div class="items-card__title">Round Start</div>
                <span>2021.1.2. 8:00:00(GMT+9) </span>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">Reward</div>
                <span>1,000,000 TON</span>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">Round end</div>
                <span>3D 2:20:30  </span>
                <p class="items-card__date">2021.1.2. 8:00:00(GMT+9)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SwapComponent from '@/components/SwapComponent.vue';
import { mapState, mapGetters } from 'vuex';
import LineChart from '@/components/LineChart.vue';
// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

// mock data
const datasets = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [{
    label: '2018 Sales',
    borderColor: 'rgba(50, 115, 220, 0.5)',
    backgroundColor: 'rgba(50, 115, 220, 0.1)',
    data: [300, 700, 450, 750, 450, 300, 700, 450, 750, 450, 750, 450],
  },
  {
    label: '2017 Sales',
    borderColor: 'rgba(255, 56, 96, 0.5)',
    backgroundColor: 'rgba(255, 56, 96, 0.1)',
    data: [600, 550, 750, 250, 700, 600, 550, 750, 250, 700, 600, 550],
  }],
};

export default {
  components: {
    SwapComponent,
    LineChart,
  },
  data () {
    return {
      data: datasets,
    };
  },
  computed: {
    ...mapState(['user', 'networkId', 'tonBalance', 'blockNumber', 'power', 'signIn']),
    ...mapGetters(['userTotalStaked', 'userTotalSeigs']),
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  created () {
    setInterval(() => this.expectedRewards(), 1000);
  },
  methods: {
    expectedRewards () {
      return this.currencyAmount(this.userTotalSeigs);
    },
  },
};
</script>
<style scoped>
.home-layout {
  min-width: 1174px;
  max-width: 1174px;
  display: flex;
  justify-content: center;
}
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 85vw;
  height: 70vh;
}
.logo {
  height: 100px;
  width: 144px;
}
.page-header {
  margin-top: 10px;
  margin-bottom: 15px;
  font-family: cursive;
  color: #555555;
  font-size: 36px;
  text-align: center;
  font-weight: 700;
  padding: 0px;
}
.page-text {
  margin-bottom: 30px;
  color: #8c8c8c;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
}
.balance-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 760px;
}

.home-stats {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.home-stats__title {
  margin: 0;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 300;
  letter-spacing: 2;
}

.home-stats__amount {
  font-size: 3.6rem;
  text-align: center;
  font-weight: 300;
}

.home-stats__amount small {
  font-weight: 800;
  margin: 0;
}

.home-footer {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.footer-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1rem;
}

.footer-items__card {
  border-radius: 1rem;
  border: 1px solid #d4d3d3;
  padding: 1rem 2rem;
}

.items-card__title {
  font-weight: 600;
  font-size: 1.2rem;
}

.items-card__date {
  font-weight: 600;
  font-size: .9rem;
  margin: 0;
}

</style>
