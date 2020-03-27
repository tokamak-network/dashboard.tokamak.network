<template>
  <div>
    <h4>Network</h4>
    <text-viewer :title="network" :content="latestBlockNumber" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'text-viewer': TextViewer,
  },
  computed: {
    ...mapState([
      'networkId',
      'blockNumber',
    ]),
    latestBlockNumber () {
      return `Latest Block: ${this.blockNumber}`;
    },
    network () {
      const id = this.networkId;
      if (id === 1) return 'Mainnet';
      else if (id === 2) return 'Morden';
      else if (id === 3) return 'Ropsten';
      else if (id === 4) return 'Rinkeby';
      else if (id === 5) return 'Goerli';
      else if (id === 42) return 'Covan';
      else if (id === 99) return 'POA';
      else if (id === 1337) return 'Development';

      return id;
    },
  },
};
</script>

<style scoped>
h4 {
  padding: 0;
  margin: 0;
}
</style>
