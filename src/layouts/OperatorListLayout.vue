<template>
  <div>
    <search-bar />
    <div class="operator-list-layout">
      <standard-table
        :columns="['ADDRESS', 'NAME', 'COMMIT TIMESTAMP', 'COMMISSION RATE']"
        :datas="datas"
        :clickable="true"
        @clickTableData="clickOperatorInfo"
      />
    </div>
  </div>
</template>

<script>
import StandardTable from '@/components/StandardTable.vue';
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    'standard-table': StandardTable,
    'search-bar': SearchBar,
  },
  data () {
    return {
      datas: [
        {
          '1': 1000,
          '2': 20000,
          '3': 3000,
          '4': 4000,
        },
      ],
    };
  },
  methods: {
    clickOperatorInfo (data) {
      this.$router.push('/operators/onther');
    },
  },
};
</script>

<style>
.operator-list-layout {
  margin-top: 8px;
  margin-bottom: -19.5px;
  border-left: solid 0.7px #ced6d9;
  border-right: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
</style>
