<template>
  <div class="delegation-state-layout">
    <chart-container :selected="selectedData" />
  </div>
</template>

<script>
import ChartContainer from '@/containers/ChartContainer.vue';
import axios from 'axios';
import { BN } from 'web3-utils';
import { createCurrency } from '@makerdao/currency';
const _WTON = createCurrency('WTON');

export default {
  components: {
    'chart-container': ChartContainer,
  },
  data () {
    return {
      selectedData: [],
      layer2: '',
    };
  },
  created () {
    this.layer2 = this.$route.params.layer2;
    this.getData();
  },
  methods: {
    async getData () {
      const rawData = await axios.get('http://localhost:4500/staking/accumulative');
      this.selectedData = rawData.data.filter(dailyData => dailyData.layer2.toLowerCase() === this.layer2);
      console.log(this.selectedData);
    },
  },
};
</script>

<style scoped>
.delegation-state-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
</style>
