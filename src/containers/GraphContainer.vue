<template>
  <div class="chart">
    <!-- <div>{{dailyStakedTotal}}</div> -->
    <line-chart
      :chartData="1"
      :datacollection="getData()"
      :option="getOptions()"
      :style="{'min-width': '1300px', 'width': '100%'}"
    />
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.vue';
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
import { orderBy } from 'lodash';
import axios from 'axios';

export default {
  components: {
    LineChart,
  },
  props: {
    dailyStakedTotal: {
      required: true,
      type: Array,
    },
  },
  data () {
    return {
      dailyStaked: this.dailyStakedTotal,
    };
  },
  computed: {
    orderedStaked () {
      return orderBy(this.dailyStaked, (staked) => staked.blockTime, ['asc']);
    },
  },
  methods: {
    displayAmount (amount) {
      const displayAmounts = parseFloat(amount) / Math.pow(10, 27);
      return Math.round(displayAmounts * 10) / 10;
    },
    formatDate (date) {
      return moment.utc(date).format('YYYY.MM.DD');
    },

    getData () {
      return {
        labels: this.orderedStaked.map((item) =>
          this.formatDate(item.blockTime)
        ),
        datasets: [
          {
            borderColor: '#2a72e5',
            borderWidth: 2,
            pointRadius: 0,
            lineTension: 0,
            backgroundColor: 'transparent',
            data: this.orderedStaked.map((item) =>
              this.displayAmount(item.totalSupply)
            ),
            yAxisID: 'y',
          },
          {
            label: 'Actual APY',
            borderColor: '#C7D1D8',
            borderWidth: 2,
            pointRadius: 0,
            lineTension: 0,
            backgroundColor: 'transparent',
            data: this.orderedStaked.map((item) => item.roi.toString() + ''),
            yAxisID: 'y1',
          },
        ],
      };
    },
    getOptions () {
      return {
        tooltips: {
          // mode: 'nearest',
          // backgroundColor: '#2a72e5',
          enabled: true,
          custom: (tooltipModel) => {
            tooltipModel.mode = 'center';
            tooltipModel.width = 160;
            tooltipModel.backgroundColor = '#2a72e5';
            tooltipModel.legendColorBackground = 'none';
            tooltipModel.bodyFontSize = 16;
            tooltipModel.footerFontSize = 12;
            tooltipModel.displayColors = false;
            tooltipModel.xAlign = 'center';
            console.log(tooltipModel);

          },
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
        legend: {
          display: false,
          position: 'top',
          align: 'center',
          fullWidth: true,
          labels: {
            usePointStyle: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };
    },
  },
};
</script>
<style scoped>
.chart {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
