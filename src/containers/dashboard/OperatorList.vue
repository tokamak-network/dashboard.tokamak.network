<template>
  <div>
    <standard-table
      :columns="['ADDRESS', 'NAME']"
      :clickable="true"
      @clickTableData="clickOperatorInfo"
    />
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
  },
  methods: {
    clickOperatorInfo (data) {
      this.$router.push('/operators/onther');
    },
  },
};
</script>

<style>
</style>
