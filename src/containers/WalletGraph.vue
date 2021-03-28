<template>
  <div class="container">
    <div class="header">
      <div class="type-selection">
        <span class="heading">Reward</span>
        <div class="button-group">
          <div :class="{active : chartType === 'week'}" class="button" @click="toggleChartType('week')">Week</div>
          <div :class="{active : chartType === 'month'}" class="button" @click="toggleChartType('month')">Month</div>
        <!-- <div :class="{active : chartType === 'year'}" class="button" @click="toggleChartType('year')">Year</div> -->
        </div>
      </div>
      <div class="date-container">
        <datepicker v-model="periodStart" input-class="Search__input" placeholder="Start Date" name="start-date" />
        <span>~</span>
        <datepicker v-model="periodEnd" input-class="Search__input" placeholder="End Date" name="end-date" />
        <div class="button">Search</div>
      </div>
    </div>
    <div class="body">
      <div class="chart">
        <line-chart v-if="chartData" :height="300" :width="1200" :chartData="chartData" :option="getOptions()" />
      </div>
      <div class="analysis">
        <h4>Analysis of Reward</h4>
        <div class="section">
          <div class="title">Total Reward</div>
          <div class="text">10,000</div>
        </div>
        <div class="section">
          <div class="title">Total Staked</div>
          <div class="text">100,000</div>
        </div>
        <div class="section">
          <div class="title">Total withdraw</div>
          <div class="text">0</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import LineChart from '@/components/LineChart.vue';
export default {
  components: {
    Datepicker,
    LineChart,
  },
  props: ['chartType', 'chartData', 'toggleChartType'],
  data () {
    return {
      periodStart: '',
      periodEnd: new Date(),
    };
  },
  methods: {
    getOptions () {
      return {
        tooltips: {
          mode: 'nearest',
          backgroundColor: '#2a72e5',
        },
        scales: {
          ticks: { min: 0 },
          layout: {
            padding: {
              left: 50,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          yAxes: [
            {
              type: 'linear',
              display: false,
              position: 'left',
              id: 'y',
            },
            {
              type: 'linear',
              display: false,
              position: 'right',
              id: 'y1',
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
        legends: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
      };
    },
  },
};
</script>

<style scoped>
    .container {
        box-shadow: 0 1px 1px 0 rgba(96, 97, 112, 0.16);
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        margin: 4px 0 23px 30px;
    }
    .header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
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
    .date-container > .button {
        background-color: #2a72e5;
        color: #ffffff;
    }
    .date-container > span {
        margin: 0 5px;
    }
    .Search__input {
        width: 66px;
        height: 18px;
        font-family: Roboto;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.23;
        letter-spacing: normal;
        text-align: center;
        color: #3e495c;
    }
    .body {
        display: grid;
        grid-template-columns: 2fr 1fr;
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
</style>
