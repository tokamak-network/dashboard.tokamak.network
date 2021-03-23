<template>
  <div>
    <table class="winner-table">
      <thead>
        <tr>
          <th class="text-center">Round</th>
          <th class="text-center">Winner</th>
          <th class="text-center">Reward</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(round, index) in rounds" :key="round.index">
          <td class="text-center">{{ index }}</td>
          <td class="text-center">{{ round.index }}</td>
          <td class="text-center">
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('address', round.winner)"
            >
              {{ round.winner | hexSlicer }}
            </a>
          </td>
          <td class="text-center">{{ round.reward | currencyAmount }}</td>
        </tr>
      </tbody>
    </table>
    <table-paginate
      :datas="rounds"
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
      base: 10,
      pages: 0,
      from: 'index',
      orderedRounds: [],
      filteredRounds: [],
    };
  },
  computed: {
    ...mapState([
      'rounds',
    ]),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
    },
    rounds () {
      return orderBy(this.rounds, (round) => round.index, 'desc');
    },
    sorted () {
      const first = this.page * 5;
      return this.rounds.slice(first, first + 5);
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
.winner-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.winner-table td, .winner-table th {
  border-bottom: solid 0.5px #dce2e5;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

tbody tr:hover {
  background-color: #f8f8f8;
}

.pointer {
  cursor: pointer;
}

tbody .clickable {
  font-weight: bolder;
  text-decoration: underline;
}

.winner-table th {
  text-align: left;
}

.winner-table td {
  text-align: left;
}

.winner-table .text-center {
  text-align: center;
}

.winner-table .text-right {
  text-align: right;
}

th {
  padding: 6px;
  background-color: #f6f8f9;
  font-family: "Noto Sans",sans-serif;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7e8d93;
}

td {
  padding: 12px;
  font-family: "Noto Sans",sans-serif;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #161819;
}

.link {
  color: black;
}
</style>
