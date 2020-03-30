<template>
  <table class="winner-table">
    <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="pointer text-center" @click="orderBy('round')">{{ withArrow('round', 'Round') }}</th>
        <th class="pointer text-center" @click="orderBy('winner')">{{ withArrow('winner', 'Winner') }}</th>
        <th class="pointer text-center" @click="orderBy('reward')">{{ withArrow('reward', 'Reward') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(round, index) in orderedRound" :key="round.index">
        <td class="text-center">{{ index }}</td>
        <td class="text-center">{{ round.index }}</td>
        <td class="text-center">{{ round.winner | hexSlicer }}</td>
        <td class="text-center">{{ round.reward | convertedTONFromWTON }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { orderBy } from 'lodash';

import { mapState } from 'vuex';

export default {
  data () {
    return {
      from: 'round',
      order: 'desc',
    };
  },
  computed: {
    ...mapState([
      'rounds',
    ]),
    orderedRound () {
      switch (this.from) {
      case 'round':
        return orderBy(this.rounds, (round) => round.index, [this.order]);

      case 'winner':
        return orderBy(this.rounds, (round) => round.winner, [this.order]);

      case 'reward':
        // TODO: test bignumber of reward.toNumber()
        return orderBy(this.rounds, (round) => round.reward.toNumber(), [this.order]);

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
.winner-table {
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: #ffffff;
}

.winner-table td, .winner-table th {
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
