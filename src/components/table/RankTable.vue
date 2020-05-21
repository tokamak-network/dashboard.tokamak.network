<template>
  <div>
    <table class="rank-table">
      <thead>
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Rank</th>
          <th class="text-center">Account</th>
          <th class="text-center">Power</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="account.address">
          <td class="text-center">{{ index }}</td>
          <td class="text-center">{{ account.rank }}</td>
          <td class="text-center">
            <a
              class="link"
              target="_blank"
              rel="noopener noreferrer"
              :href="toExplorer('address', account.address)"
            >
              {{ account.address | hexSlicer }}
            </a>
          </td>
          <td class="text-center">{{ account.power | currencyAmount }}</td>
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

import { mapGetters } from 'vuex';
import TablePaginate from '@/components/TablePaginate.vue';

export default {
  components: {
    'table-paginate': TablePaginate,
  },
  data () {
    return {
      base: 10,
      pages: 0,

      orderedAccounts: [],
      accounts: [],
    };
  },
  computed: {
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    toExplorer () {
      return (type, param) => this.$options.filters.toExplorer(type, param);
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

    this.pages = parseInt(this.rankedAccountsWithPower.length / this.base) + 1;
    if (this.pages > 1 && this.rankedAccountsWithPower.length % this.base === 0) {
      this.pages = this.pages - 1;
    }

    this.orderedAccounts = orderBy(this.rankedAccountsWithPower, (account) => account.rank, 'asc');
    this.accounts = this.orderedAccounts.slice(0, this.base);
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
      this.accounts = this.orderedAccounts.slice((page - 1) * this.base, page * this.base);
    },
  },
};
</script>

<style scoped>
.rank-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.rank-table td, .rank-table th {
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

.rank-table th {
  text-align: left;
}

.rank-table td {
  text-align: left;
}

.rank-table .text-center {
  text-align: center;
}

.rank-table .text-right {
  text-align: right;
}

th {
  padding: 6px;
  background-color: #f6f8f9;
  font-family: Roboto;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7e8d93;
}

td {
  padding: 12px;
  font-family: Roboto;
  font-size: 10px;
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
