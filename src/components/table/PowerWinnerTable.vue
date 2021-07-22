<template>
  <div class="table-container">
    <h1>Winner</h1>
    <table class="winner-table table-common">
      <thead>
        <tr>
          <th class="table-th-text table-th-text-small">#</th>
          <th class="table-th-text table-th-text-small">Round</th>
          <th class="table-th-text table-th-text-medium">Winner</th>
          <th class="table-th-text table-th-text-large">Reward</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(round, index) in sorted" :key="round.data.round">
          <td class="text-center">{{ index }}</td>
          <td class="text-center">
            {{ round.data.round }}
          </td>
          <td class="text-center">
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('address', round.data.winner)"
            >
              {{ round.data.winner | hexSlicer }}
            </a>
          </td>
          <td class="text-center">{{ round.winnerReward | currencyAmount }}</td>
        </tr>
      </tbody>
    </table>
    <table-paginate
      :datas="orderedRounds"
      @on-selected="updateTableByPage"
    />
  </div>
</template>

<script>
import { orderBy } from 'lodash';

import { mapState } from 'vuex';
import TablePaginate from '@/components/TablePaginate.vue';

export default {
  components: {
    'table-paginate': TablePaginate,
  },
  data () {
    return {
      base: 5,
      pages: 0,
      page: 0,
      from: 'index',
    };
  },
  computed: {
    ...mapState([
      'winnerList',
    ]),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    formattedTimestamp () {
      return timestamp => this.$options.filters.formattedTimestamp(timestamp);
    },
    orderedRounds () {
      return orderBy(this.winnerList, (round) => round.index, 'desc');
    },
    sorted () {
      const first = this.page * 5;
      return this.orderedRounds.slice(first, first + 5);
    },
  },
  // mounted () {
  //   const addressLinks = this.$el.getElementsByClassName('link');

  //   Object.values(addressLinks).map(link => {
  //     const address = this.$options.filters.addressExtractor(link.href);
  //     link.addEventListener('copy', e => {
  //       e.clipboardData.setData('text/plain', address);
  //       e.preventDefault();
  //     });
  //   });

  //   this.pages = parseInt(this.rounds.length / this.base) + 1;
  //   if (this.pages > 1 && this.rounds.length % this.base === 0) {
  //     this.pages = this.pages - 1;
  //   }

  //   this.orderedRounds = orderBy(this.rounds, (round) => round.index, 'desc');
  //   this.filteredRounds = this.orderedRounds.slice(0, this.base);
  // },
  methods: {
    orderBy (from) {
      if (this.from === from) {
        this.order = this.changedOrder();
      } else {
        this.from = from;
        this.order = 'desc';
      }
    },
    changedOrder () {
      return this.order === 'desc' ? 'asc' : 'desc';
    },
    updateTableByPage (page) {
      this.page = page;
    },
  },
};
</script>

<style scoped>
.power-table {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.table-common {
  width: 542px;
}
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 330px;
}
.table-container h1{
  font-size: 18px;
  color: #3d495d;
  font-weight: bold;
}
.table-th-text {
  font-size: 13px;
  color: #808992;
  font-weight: 500;
  height: 40px;
}
.table-th-text-small {
  width: 70px;
}
.table-th-text-medium {
  width: 190px;
}
.table-th-text-large {
  width: 212px;
}
th {
  height: 40px;
  border-bottom: dashed 1px #edf0ee;
}
td {
  text-align: center;
  height: 38px;
  font-size: 14px;
  color: #304156;
  border-bottom: dashed 1px #edf0ee;
}
a {
  font-size: 14px;
  color: #2a72e5;
  text-decoration:none
}
</style>
