<script>
//Importing Line class from the vue-chartjs wrapper
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp, reactiveData } = mixins;
//Exporting this so it can be used in other components
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Number,
    },
    datacollection: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | Array,
      required: false,
      // default: null,
    },
    option: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Object | Array,
    },
  },
  data () {
    return {};
  },
  mounted () {
    //renderChart function renders the chart with the datacollection and options object.
    this.renderChart(this.datacollection, this.option);
  },
};
</script>
