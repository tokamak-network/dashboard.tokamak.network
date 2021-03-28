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
          <!-- <div :class="{active : chartType === 'year'}" class="button" @click="toggleChartType('year')">Year</div> -->
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
    <div class="divider"></div>
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

export default {
  components: {
    Datepicker,
    'wallet-line-chart': WalletLineChart,
  },
  // props: ['chartType', 'chartData', 'toggleChartType'],
  data () {
    return {
      periodEnd: new Date(),
      periodStart: new Date(),
      dailyWalletRewardsList: [],
      dailyWalletStakedList: [],
      dailyWalletRewards: {},
      chartType: 'week',
      weekLabels: ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 05'],
      monthLabels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
  },
  computed: {
    ...mapState(['totalWithdraw', 'user']),
    currencyAmount () {
      return (amount) => this.$options.filters.currencyAmount(amount);
    },
    style () {
      return {
        'width': '105px',
        'height': '32px',
        'font-family': 'Roboto',
        'font-size': '13px',
        'font-weight': 'normal',
        'font-stretch': 'normal',
        'font-style': 'normal',
        'line-height': 1.23,
        'letter-spacing': 'normal',
        'text-align': 'center',
        'color': '#3e495c',
      };
    },
  },
  created () {
    this.periodStart.setDate(this.periodStart.getDate() - 7);
    this.getDailyWalletRewardsFn();
    this.getDailyWalletStakedFn();
    this.toggleChartType('week');
  },
  methods: {
    customFormatter (date) {
      return moment(date).format('YYYYMMDD');
    },
    totalReward () {
      const initialAmount = 0;
      const reducer = (amount, day) => amount + day.rewards;
      return _WTON.ray(
        this.dailyWalletRewardsList.reduce(reducer, initialAmount).toString()
      );
    },

    totalStaked () {
      const initialAmount = 0;
      const reducer = (amount, day) => amount + day.balanceOf;
      return _WTON.ray(
        this.dailyWalletStakedList.reduce(reducer, initialAmount).toString()
      );
    },
    displayAmount (amount) {
      const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
      return Math.round(displayAmounts * 10) / 10;
    },
    async getDailyWalletRewardsFn (chartType) {
      const dailyWalletRewards = await getDailyWalletRewards(
        this.networkId,
        this.user.toLowerCase(),
        this.customFormatter(this.periodStart),
        this.customFormatter(this.periodEnd)
      );
      if (dailyWalletRewards.length !== 0) {
        this.dailyWalletRewardsList = dailyWalletRewards;
        this.totalReward();
        this.dailyWalletRewards = {
          labels: chartType,
          datasets: [
            {
              backgroundColor: 'transparent',
              borderColor: '#2a72e5',
              data: dailyWalletRewards.map((item) =>
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
      this.chartType = chartType;
      if (chartType === 'week') {
        this.getDailyWalletRewardsFn(this.weekLabels);
      } else if (chartType === 'month') {
        this.getDailyWalletRewardsFn(this.monthLabels);
      } else if (chartType === 'year') {
        this.getDailyWalletRewardsFn(this.yearLabels);
      }
    },
    search () {
      this.getDailyWalletRewardsFn();
      this.getDailyWalletStakedFn();
    },
  },
};
</script>

<style>
.container {
  box-shadow: 0 1px 1px 0 rgba(96, 97, 112, 0.16);
  background-color: #ffffff;
  /* padding: 20px; */
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
  color:#3e495c;
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
 </style>
