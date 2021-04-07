<template>
  <div class="container">
    <div class="header">
      <div class="type-selection">
        <span class="heading">Reward</span>
        <div class="button-group">
          <div
            :class="{ active: chartType === 'week' }"
            class="button"
            @click="toggleChartType('week')"
          >
            Week
          </div>
          <div
            :class="{ active: chartType === 'month' }"
            class="button"
            @click="toggleChartType('month')"
          >
            Month
          </div>
          <!-- <div
            :class="{ active: chartType === 'year' }"
            class="button"
            @click="toggleChartType('year')"
          >
            Year
          </div> -->
        </div>
      </div>
      <div class="date-container">
        <datepicker
          v-model="periodStart"
          placeholder="Start Date"
          input-class="search-input"
          name="start-date"
          format="yyyy.MM.dd"
          type="date"
        />
        <span style="color:#3e495c">~</span>
        <div>
          <datepicker
            v-model="periodEnd"
            input-class="search-input"
            placeholder="End Date"
            name="end-date"
            format="yyyy.MM.dd"
          />
        </div>
        <button class="search-button" @click="search()">Search</button>
      </div>
    </div>
    <div class="divider" />
    <div class="body">
      <div class="chart">
        <wallet-line-chart
          v-if="dailyWalletRewards"
          :height="300"
          :width="854"
          :chartData="dailyWalletRewards"
        />
      </div>
      <div class="analysis">
        <h4>Analysis of Reward</h4>
        <div class="section">
          <div class="title">Total Reward</div>
          <div class="text">{{ currencyAmount(totalReward()) }}</div>
        </div>
        <div class="section">
          <div class="title">Total Staked</div>
          <div class="text">{{ currencyAmount(totalStaked()) }}</div>
        </div>
        <div class="section">
          <div class="title">Total withdraw</div>
          <div class="text">{{ currencyAmount(totalWithdraw) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import WalletLineChart from '@/components/WalletLineChart.vue';
import moment from 'moment';
import { mapState } from 'vuex';
const _WTON = createCurrency('WTON');
import { createCurrency } from '@makerdao/currency';
import { getDailyWalletStaked, getDailyWalletRewards } from '@/api';
import { orderBy } from 'lodash';
import BigNumber from 'bignumber.js';
export default {
  components: {
    Datepicker,
    'wallet-line-chart': WalletLineChart,
  },
  data () {
    return {
      periodEnd: new Date(),
      periodStart: new Date(),
      dailyWalletRewardsList: [],
      dailyWalletStakedList: [],
      dailyWalletRewards: {},
      chartType: 'week',
    };
  },
  computed: {
    ...mapState(['totalWithdraw', 'user']),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
  },
  created () {
    const end = moment(this.periodEnd).unix();
    const start = Number(end) - 518400;
    this.getDailyWalletRewardsFn(
      this.customFormatter(start),
      this.customFormatter(this.periodEnd)
    );
    this.getDailyWalletStakedFn();
    this.toggleChartType('week');
  },
  methods: {
    customFormatterforFunction (date) {
      return moment(date * 1000).format('YYYYMMDD');
    },
    customFormatter (date) {
      return moment(date).format('YYYYMMDD');
    },
    formatDate (date) {
      return (
        date.toString().substring(0, 4) +
        '/' +
        date.toString().substring(4, 6) +
        '/' +
        date.toString().substring(6, 8)
      );
    },
    totalReward () {
      const initialAmount = new BigNumber('0');
      const reducer = (amount, day) =>
        amount.plus(new BigNumber(day.rewards.toString()));
      return _WTON.ray(
        this.dailyWalletRewardsList.reduce(reducer, initialAmount).toString()
      );
    },
    totalStaked () {
      const initialAmount = new BigNumber('0');
      const reducer = (amount, day) =>
        amount.plus(new BigNumber(day.balanceOf.toString()));
      return _WTON.ray(
        this.dailyWalletStakedList.reduce(reducer, initialAmount).toString()
      );
    },
    displayAmount (amount) {
      const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
      return Math.round(displayAmounts * 10) / 10;
    },
    async getDailyWalletRewardsFn (start, end) {
      const dailyWalletRewards = await getDailyWalletRewards(
        this.networkId,
        this.user.toLowerCase(),
        start,
        end
      );
      if (dailyWalletRewards.length !== 0) {
        this.dailyWalletRewardsList = orderBy(
          dailyWalletRewards,
          (staked) => staked._id.dateUTC,
          ['asc']
        );
        this.totalReward();
        this.dailyWalletRewards = {
          labels: this.dailyWalletRewardsList.map((item) =>
            this.formatDate(item._id.dateUTC)
          ),
          datasets: [
            {
              backgroundColor: 'transparent',
              borderColor: '#2a72e5',
              data: this.dailyWalletRewardsList.map((item) =>
                this.displayAmount(item.rewards)
              ),
            },
          ],
        };
      }
    },
    async getDailyWalletStakedFn () {
      const dailyWalletStaked = await getDailyWalletStaked(
        this.networkId,
        this.user.toLowerCase(),
        this.customFormatter(this.periodStart),
        this.customFormatter(this.periodEnd)
      );
      this.dailyWalletStakedList = dailyWalletStaked;
      this.totalStaked();
    },
    toggleChartType (chartType) {
      if (chartType === 'week') {
        const end = moment(this.periodEnd).unix();
        const start = Number(end) - 518400;
        this.getDailyWalletRewardsFn(
          this.customFormatterforFunction(start),
          this.customFormatterforFunction(this.periodEnd)
        );
      } else if (chartType === 'month') {
        const end = moment(this.periodEnd).unix();
        const start = Number(end) - 2592000;
        this.getDailyWalletRewardsFn(
          this.customFormatterforFunction(start),
          this.customFormatterforFunction(this.periodEnd)
        );
      } else if (chartType === 'year') {
        this.periodStart.setDate(this.periodEnd.getFullYear() - 1);
      }
      this.chartType = chartType;
    },
    search () {
      this.getDailyWalletRewardsFn(
        this.customFormatter(this.periodStart),
        this.customFormatter(this.periodEnd)
      );
      this.getDailyWalletStakedFn();
    },
  },
};
</script>

<style>
.container {
  box-shadow: 0 1px 1px 0 rgba(96, 97, 112, 0.16);
  background-color: #ffffff;
  border-radius: 10px;
  margin: 4px 0 23px 30px;
  width: 1114px;
}
.header {
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 21px;
}
.type-selection {
  display: flex;
  align-items: center;
}
.heading {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
}
.button-group {
  display: flex;
  margin-left: 50px;
}
.button {
  height: 16px;
  margin: 4px;
  padding: 4px 35px 5px;
  border-radius: 4px;
  background-color: #ffffff;
  width: 30px;
  border: solid 1px #dfe4ee;
  cursor: pointer;
}
.date-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: -webkit-fill-available;
}
.search-button {
  width: 100px;
  height: 32px;
  border-radius: 4px;
  background-color: #257eee;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  margin-left: 10px;
}
/* .date-container > .button {
        background-color: #2a72e5;
        color: #ffffff;
    } */
.date-container > span {
  margin: 0 5px;
}
.search-input {
  width: 105px;
  height: 32px;
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: center;
  border: solid 1px #dfe4ee;
  border-radius: 4px;
  color: #3e495c;
  outline: none;
}
.body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 20px;
}
.analysis {
  padding-left: 47px;
}
.analysis > h4 {
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #808992;
}
.analysis > .section > .title {
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
}
.analysis > .section > .text {
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #808992;
}
.analysis > .section {
  margin-bottom: 25px;
}
.active {
  border: solid 1px #2a72e5 !important;
}
button:focus {
  outline: none;
}
.divider {
  width: 100%;
  height: 1px;
  margin-bottom: 20px;
  background-color: #f4f6f8;
}

.vdp-datepicker__calendar .day,
.vdp-datepicker__calendar .month,
.vdp-datepicker__calendar .year {
  font-size: 14px;
  font-weight: 500;
}

.vdp-datepicker__calendar .day {
  border-radius: 50%;
}

.vdp-datepicker__calendar .month {
  border-radius: 3px;
}

.vdp-datepicker__calendar .year {
  border-radius: 3px;
}

.vdp-datepicker__calendar .cell.selected {
  color: #ffffff;
  background: #2a72e5 !important;
}

.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).day:hover,
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).month:hover,
.vdp-datepicker__calendar .cell:not(.blank):not(.disabled).year:hover {
  border: 1px solid #2a72e5 !important;
}
</style>
