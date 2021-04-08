<template>
  <div class="chart">
    <!-- <div>{{dailyStakedTotal}}</div> -->
    <line-chart
      :chartData="1"
      :datacollection="getData()"
      :option="getOptions()"
      :style="{'min-width': '1300px', 'width': '100%', 'height': '250px'}"
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
import { plugins } from 'chart.js';
export default {
  components: {
    LineChart,
  },
  props: {
    dailyStakedTotal: {
      required: true,
      type: Array,
    },
    totalSupply: {
      required: true,
      type: Number,
    },
  },
  data () {
    return {
      dailyStaked: this.dailyStakedTotal,
    };
  },
  computed: {
    orderedStaked () {
      // console.log(this.totalSupply);
      // const test = orderBy(this.dailyStaked, (staked) => staked.blockTime, ['asc'])[this.dailyStaked.length-1].totalSupply = this.totalSupply;
      // console.log(test);
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
            pointHitRadius: 10,
            backgroundColor: 'transparent',
            data: this.getLatestData(),
            yAxisID: 'y',
          },
          {
            label: 'Actual APY',
            borderColor: '#C7D1D8',
            borderWidth: 2,
            pointRadius: 0,
            lineTension: 0,
            pointHitRadius: 10,
            backgroundColor: 'transparent',
            data: this.orderedStaked.map((item) => item.roi.toString() + ''),
            yAxisID: 'y1',
          },
        ],
      };
    },
    getLatestData () {
      //Change last value to sync with rolling number
      //rolling number is more latest value
      const result = [];
      this.orderedStaked.map((item, index) =>{
        if(index === this.orderedStaked.length-1) {
          const test = this.totalSupply.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });
          return result.push(Number(test.replace(/,/g, '')));
        }
        result.push(this.displayAmount(item.totalSupply));
      }
      );
      return result;
    },
    getOptions () {
      let testX = 0;
      let testY = 0;
      let valueLength = 0;
      return {
        tooltips: {
          // mode: 'nearest',
          // backgroundColor: '#2a72e5',
          enabled: true,
          custom: (tooltipModel) => {
            if(tooltipModel.dataPoints !== undefined) {
              const typeAPY = tooltipModel.dataPoints[0].value < 200;
              tooltipModel.width = typeAPY ? valueLength * 22 : valueLength * 16;
              tooltipModel.height = 46;
              tooltipModel.cornerRadius = 3;
              tooltipModel.backgroundColor = typeAPY ? '#84919e' : '#2a72e5';
              tooltipModel.legendColorBackground = 'none';
              tooltipModel.bodyFontSize = 16;
              tooltipModel.footerFontSize = 12;
              tooltipModel.displayColors = false;
              tooltipModel.caretSize = 5;
              tooltipModel.yAlign = 'bottom';
              tooltipModel.xAlign = 'center';
              tooltipModel.x = testX;
              tooltipModel.y = testY;
              tooltipModel.xPadding = 10;
              tooltipModel.yPadding = 7;
              tooltipModel._titleFontStyle = 'normal';
              tooltipModel._bodyFontFamily = '"TitilliumWeb",sans-serif';
              tooltipModel._footerFontFamily = 'Roboto';
              tooltipModel._footerFontStyle = 'normal';
            }

            // tooltipModel._footerFontFamily = 'TitilliumWeb';
          },
          callbacks: {
            label: function (tooltipItem) {
              const typeAPY = tooltipItem.yLabel < 200;
              valueLength = String(tooltipItem.yLabel).length;
              testX = typeAPY ? tooltipItem.x - valueLength * 11 : tooltipItem.x - valueLength * 8;
              testY = tooltipItem.y - 55;
              return  typeAPY ? 'APY ' + tooltipItem.yLabel*100 + '%' : String(tooltipItem.yLabel).replace(/[^0-9a-zA-Z.]/g, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TON';
            },
          },
        },
        layout: {
          padding: {
            top: 50,
            bottom: 50,
            left: 70,
            right: 70,
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
