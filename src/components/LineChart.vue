<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['chartData'],
  data () {
    return {
      options: {
        tooltips: {
          enabled: true,
          mode: 'nearest',
          backgroundColor: 'black',
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
            stacked: true,
            ticks: {
              beginAtZero: true,
              userCallback: function (value, index, values) {
                if (value > 999) {
                  value = (value / 1000).toLocaleString('en-US') + 'k';
                }
                return value;
              },
            },
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Staked (TON)',
            },
          }],
          xAxes: [ {
            gridLines: {
              display: false,
            },
            scaleLabel: {
              display: true,
              labelString: 'Years',
            },
          }],
        },
        legend: {
          display: true,
          position: 'left',
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  mounted () {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
