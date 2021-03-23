<template>
  <div class="chart">
    <line-chart :chartData="1" :datacollection="datacollection" :option="options" />
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.vue';
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

export default {
  components: {
    LineChart,
  },
  props: ['dailyStakedTotal'],
  data () {
    return {
      options: {
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
          yAxes: [{
            display: false,
          }],
          xAxes: [ {
            display: false,

          }],
        },
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          fullWidth: true,
          labels: {
            usePointStyle: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
      datacollection: {
        labels: this.dailyStakedTotal.map(item =>this.formatDate(item.blockTime)).sort(),
        datasets: [
          {
            label: 'Total Stake',
            borderColor: '#2a72e5',
            borderWidth: 2,
            pointStyle: 'line',
            lineTension: 0,
            backgroundColor: 'transparent',
            data: this.dailyStakedTotal.map(item => this.displayAmount(item.totalSupply)).sort(),
          },
        ],
      },
    };
  },
  methods: {

    displayAmount (amount) {
      const displayAmounts = parseFloat(amount) / (Math.pow(10, 27));
      console.log(displayAmounts);
      return Math.round(displayAmounts * 10) / 10;
    },
    formatDate (date) {
      return moment.utc(date).format('MM/DD/YYYY HH:mm');
    },
  },
};
</script>
