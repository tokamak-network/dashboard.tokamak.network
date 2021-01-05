<template>
  <div>
    <div class="chart-header">Delegate(Accumulative)</div>
    <chart :width="300" :height="100" :chartData="chartData(accStake)" />
    <div class="chart-header">Undelegate(Accumulative)</div>
    <chart :width="300" :height="100" :chartData="chartData(accUnstake)" />
    <div class="chart-header">Delegate(Daily)</div>
    <chart :width="300" :height="100" :chartData="chartData(dailyStake)" />
    <div class="chart-header">Undelegate(Daily)</div>
    <chart :width="300" :height="100" :chartData="chartData(dailyUnstake)" />
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
          },
        ],
      };
    },
    classifyData () {
      console.log(this.selected);
      // for (const data of this.selectedData) {
      for (let i=0; i<this.selected.length; i++){
        // console.log(this.selectedData[i]);
        this.accStake.push(this.convertToNumber(this.selected[i].accStaked));
        this.accUnstake.push(this.convertToNumber(this.selected[i].accUnstaked));
        this.dailyStake.push(this.convertToNumber(this.selected[i].dailyStaked));
        this.dailyUnstake.push(this.convertToNumber(this.selected[i].dailyUnstaked));
        this.labels.push(this.convertToDate(this.selected[i].date));
      }
    },
    convertToNumber (staked) {
      const wtonUnit = _WTON(staked, 'ray');
      return Number(wtonUnit.toBigNumber().toString());
    },
    convertToDate (timestamp) {
      const date = new Date(timestamp * 1000);
      const month = date.getMonth();
      const day = date.getDate();
      return month + '/' + day;
    },
  },
};
</script>

<style scoped>
.chart-header {
  font-size: 15px;
  margin-top: 10px;
  padding-left: 10px;
}
</style>
