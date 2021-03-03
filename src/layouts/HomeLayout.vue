<template>
  <div>
    <div v-if="signIn" class="home-layout">
      <div class="home-content">
        <img class="logo" alt="Tokamak Logo" src="@/assets/images/TokamakLogo.png" />
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

          <div class="home-footer">
            <div class="footer-items">
              <div class="footer-items__card">
                <div class="items-card__title">Nominal APY</div>
                <span>Description Description Description</span>
                <p class="items-card__percentage">19%</p>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">Actual APY</div>
                <span>Description Description Description</span>
                <p class="items-card__percentage">5%</p>
              </div>
              <div class="footer-items__card">
                <div class="items-card__title">XX Round</div>
                <span>Reward</span>
                <p class="items-card__percentage">5%</p>
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
// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

export default {
  components: {
    SwapComponent,
  },
  computed: {
    ...mapState(['user', 'networkId', 'tonBalance', 'blockNumber', 'power', 'signIn']),
    ...mapGetters(['userTotalStaked', 'userTotalSeigs']),
    currencyAmount() {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
  created() {
    setInterval(() => this.expectedRewards(), 1000);
  },
  methods: {
    expectedRewards() {
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
  /* align-items: center; */
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
  height: 50vh;
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

.items-card__percentage {
  font-weight: 600;
  font-size: .9rem;
  margin: 0;
}

</style>
