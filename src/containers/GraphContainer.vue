<template>
  <div class="chart">
    <!-- <div>{{dailyStakedTotal}}</div> -->
    <line-chart
      :chartData="1"
      :datacollection="getData()"
      :option="getOptions()"
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
      return moment.utc(date).format('MM/DD/YYYY HH:mm');
    },

    getData () {
      return {
        labels: this.orderedStaked.map((item) =>
          this.formatDate(item.blockTime)
        ),
        datasets: [
          {
            label: 'Total Stake',
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
          mode: 'nearest',
          backgroundColor: '#2a72e5',
          enabled: false,
          multiKeyBackground: 'rgba(0, 0, 0, 0)',
          titleFontSize: 12,
          bodyFontSize: 16,
          callbacks: {
            label: function (tooltipItem) {
              return `${Number(tooltipItem.yLabel)} TON`;
            },
          },

          custom: function (tooltipModel) {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip');

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            function getBody (bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              const titleLines = tooltipModel.title || [];
              const bodyLines = tooltipModel.body.map(getBody);

              let innerHtml = '<thead>';


              titleLines.forEach(function (title) {
                innerHtml += '<tr><th>' + title + '</th></tr>';
              });
              innerHtml += '</thead><tbody>';

              bodyLines.forEach(function (body, i) {
                const colors = tooltipModel.labelColors[i];
                const style = 'font-size: 16px';
                // style += '; border-color:' + colors.borderColor;
                // style += '; border-width: 2px';
                const span = '<span style="' + style + '"></span>';
                innerHtml += '<tr><td>' + span + body[0].split(':')[1] + ' TON' + '</td></tr>';
              });
              innerHtml += '</tbody>';

              const tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            const position = this._chart.canvas.getBoundingClientRect();

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            tooltipEl.style.backgroundColor = '#2a72e5';
            tooltipEl.style.padding = tooltipModel.xPadding + 'px';
            tooltipEl.style.height = '100px';
            tooltipEl.style.pointerEvents = 'none';
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
.chartjs-tooltip-key {
  display: none !important;
}
</style>
