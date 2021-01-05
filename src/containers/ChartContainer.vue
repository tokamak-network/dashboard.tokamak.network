<template>
  <div>
    <div class="title">{{ layer2 }}</div>
    <div class="chart-header">Delegate(Accumulative)</div>
    <chart :width="300" :height="300" :chartData="chartData(accStake)" :options="chartOptions()" />
    <div class="chart-header">Undelegate(Accumulative)</div>
    <chart :width="300" :height="300" :chartData="chartData(accUnstake)" :options="chartOptions()" />
    <div class="chart-header">Delegate(Daily)</div>
    <chart :width="300" :height="300" :chartData="chartData(dailyStake)" :options="chartOptions()" />
    <div class="chart-header">Undelegate(Daily)</div>
    <chart :width="300" :height="300" :chartData="chartData(dailyUnstake)" :options="chartOptions()" />
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue';

import axios from 'axios';
import { BN } from 'web3-utils';
import { createCurrency } from '@makerdao/currency';
const _WTON = createCurrency('WTON');

export default {
  components: {
    'chart': Chart,
  },
  props: [ 'selected' ],
  data () {
    return {
      labels: [],
      layer2: '',
      accStake: [],
      accUnstake: [],
      dailyStake: [],
      dailyUnstake: [],
    };
  },
  created () {
    this.layer2 = this.$route.params.layer2;
    this.classifyData();
  },
  methods: {
    chartData (data) {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'one',
            data: data,
            pointBorderColor: '#249EBF',
            pointBackgroundColor: '#white',
          },
        ],
      };
    },
    chartOptions () {
      return {
        legend: { display: false },
        responsive:true,
        maintainAspectRatio: false,
        height: 300,
        responsiveAnimationDuration: 0,
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 10,
                beginAtZero: true,
              },
              scaleLabel: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Stake (TON)',
              },
              stacked: true,
              ticks:{
                userCallback: function (value, index, values) {
                  return value.toLocaleString('en-US');
                },
              },
            },
          ],
        },
      };
    },
    async classifyData () {
      const rawData = await axios.get('https://price-api.tokamak.network/staking/accumulative');
      const data = rawData.data.filter(dailyData => dailyData.layer2.toLowerCase() === this.layer2);

      for (let i=0; i<data.length; i++){
        this.accStake.push(this.convertToNumber(data[i].accStaked));
        this.accUnstake.push(this.convertToNumber(data[i].accUnstaked));
        this.dailyStake.push(this.convertToNumber(data[i].dailyStaked));
        this.dailyUnstake.push(this.convertToNumber(data[i].dailyUnstaked));
        this.labels.push(this.convertToDate(data[i].date));
      }
    },
    convertToNumber (staked) {
      const wtonUnit = _WTON(staked, 'ray');
      return Number(wtonUnit.toBigNumber().toString());
    },
    convertToDate (timestamp) {
      const date = new Date(timestamp * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return month + '/' + day;
    },
  },
};
</script>

<style scoped>
.chart-header {
  font-size: 15px;
  margin: 10px 0 10px 0;
  padding-left: 10px;
}
</style>
