<template>
  <div>
    <table class="winner-table">
      <thead>
        <tr>
          <th class="text-center">Round</th>
          <th class="text-center">Winner</th>
          <th class="text-center">Reward</th>
          <th class="text-center">Round End Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(round) in filteredRounds" :key="round.index">
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
          <td class="text-center">{{ round.timestamp | formattedTimestamp }}</td>
        </tr>
      </tbody>
    </table>
    <table-paginate
      :pages="pages"
      @update-page="updateTableByPage"
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
    formattedTimestamp () {
      return timestamp => this.$options.filters.formattedTimestamp(timestamp);
    },
  },
  mounted () {
    const addressLinks = this.$el.getElementsByClassName('link');

    Object.values(addressLinks).map(link => {
      const address = this.$options.filters.addressExtractor(link.href);
      link.addEventListener('copy', e => {
        e.clipboardData.setData('text/plain', address);
        e.preventDefault();
      });
    });

    this.pages = parseInt(this.rounds.length / this.base) + 1;
    if (this.pages > 1 && this.rounds.length % this.base === 0) {
      this.pages = this.pages - 1;
    }

    this.orderedRounds = orderBy(this.rounds, (round) => round.index, 'desc');
    this.filteredRounds = this.orderedRounds.slice(0, this.base);
  },
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
      this.filteredRounds = this.orderedRounds.slice((page - 1) * this.base, page * this.base);
    },
  },
};
</script>

<style scoped>
.winner-table {
  table-layout: auto;
   width: 500px;
  background-color:#e2e8eb;
  border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
  box-shadow: inset 1px 1px 0px #e2e8eb;
  padding: 5px 10px;
}

.winner-table td, .winner-table th {
  border-bottom: solid 0.5px #dce2e5;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

tbody tr:hover {
  background-color: #e2e8eb;
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
   background-color:#e2e8eb;
  color: #444444;
    font-size: 14px;
  font-family: "Noto Sans",sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;

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
  color: #555555;
}

.link {
  color: #555555;
}
</style>
