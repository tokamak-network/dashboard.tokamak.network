<template>
  <div class="viewer-power-container">
    <container-header :title="'My Power'" />
    <text-viewer :title="'Power'" :content="currencyAmount(power)" :with-divider="true" />
    <text-viewer :title="'Rank'" :content="rank" :with-divider="false" />
  </div>
</template>

<script>
import ContainerHeader from '@/containers/ContainerHeader.vue';
import TextViewer from '@/components/TextViewer.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'text-viewer': TextViewer,
  },
  props: {
    power: {
    },
    rank: {
    },
  },
  computed: {
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
  },
};
</script>

<style scoped>
.viewer-power-container {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}

.column {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
