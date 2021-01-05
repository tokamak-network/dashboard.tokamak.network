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
  mounted () {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
<style></style>
