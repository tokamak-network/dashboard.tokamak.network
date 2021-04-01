<script>
//Importing Line class from the vue-chartjs wrapper
import { Line, mixins } from 'vue-chartjs';
import Chart from 'chart.js';
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
    Chart.Tooltip.positioners.custom = (elements, eventPosition) => {
      /** @type {Chart.Tooltip} */
      const tooltip = this.Tooltip;
      /* ... */

      if (!elements.length) {
        return false;
      }
      let offset = 0;
      //adjust the offset left or right depending on the event position
      if (elements[0]._chart.width / 2 > eventPosition.x) {
        offset = 20;
      } else {
        offset = -20;
      }
      return {
        x: eventPosition.x + offset - 50,
        y: eventPosition.y - 30,
      };
    };
  },
};
</script>
