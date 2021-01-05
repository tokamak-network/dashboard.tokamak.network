<script>
import { Bar, mixins } from 'vue-chartjs';
import moment from 'moment';
const { reactiveProp } = mixins;

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
    },
    options: {
      type: Object,
    },
  },
  data () {
    return {
      datacollection: {
        labels: this.label,
        datasets: [
          {
            label: 'one',
            data: this.data,
          },
        ],
      },
    };
  },
  mounted () {
    // console.log(this.chartData);
    this.renderChart(this.chartData, this.options);
  },
};
</script>
<style></style>
