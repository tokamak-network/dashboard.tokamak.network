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
            // gridLines: {
            //   display: false,
            // },
            // scaleLabel: {
            //   display: true,
            //   labelString: 'Staked (TON)',
            // },
          }],
          xAxes: [ {
            display: false,
            // gridLines: {
            //   display: false,
            // },
            // scaleLabel: {
            //   display: true,
            //   labelString: 'Years',
            // },
          }],
        },
        legend: {
          display: true,
          align: 'center',
          fullWidth: true,
          labels: {
            usePointStyle: true,
          },
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
