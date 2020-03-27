<template>
  <div>
    <div class="operator-list-layout">
      <operator-table />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import OperatorTable from '@/components/table/OperatorTable.vue';

export default {
  components: {
    'operator-table': OperatorTable,
  },
  data () {
    return {
      columns: [],
    };
  },
  computed: mapState([
    'operators',
  ]),
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
  },
};
</script>

<style scoped>
.operator-list-layout {
  /* border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px; */
}
</style>
