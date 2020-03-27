<template>
  <table class="rank-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('rank')">{{ withArrow('rank', 'Rank') }}</th>
        <th class="pointer text-center" @click="orderBy('account')">{{ withArrow('account', 'Account') }}</th>
        <th class="pointer text-right" @click="orderBy('power')">{{ withArrow('power', 'Power') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(account, index) in orderedRank" :key="account.address">
        <td class="text-center">{{ index }}</td>
        <td class="text-center">{{ account.rank }}</td>
        <td class="text-center">{{ account.address | hexSlicer }}</td>
        <td class="text-right">{{ account.power }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { orderBy } from 'lodash';

import { mapGetters } from 'vuex';

export default {
  data () {
    return {
      from: 'rank',
      order: 'desc',
    };
  },
  computed: {
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
    orderedRank () {
      switch (this.from) {
      case 'rank':
        return orderBy(this.rankedAccountsWithPower, (account) => account.rank, [this.order]);

      case 'account':
        return orderBy(this.rankedAccountsWithPower, (account) => account.address, [this.order]);

      case 'power':
        return orderBy(this.rankedAccountsWithPower, (account) => account.power.toNumber(), [this.order]);

      default:
        return [];
      }
    },
    withArrow () {
      return (from, label) => {
        if (this.from === from) {
          return this.order === 'desc' ? `${label} ↑` : `${label} ↓`;
        }
        return label;
      };
    },
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
  border-top: solid 0.5px #dce2e5;
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
</style>
