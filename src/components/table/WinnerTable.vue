<template>
  <table class="winner-table">
    <thead>
      <tr>
        <th class="pointer text-center" @click="orderBy('round')">{{ withArrow('round', 'Round') }}</th>
        <th class="pointer text-center" @click="orderBy('winner')">{{ withArrow('winner', 'Winner') }}</th>
        <th class="pointer text-right" @click="orderBy('reward')">{{ withArrow('reward', 'Reward') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="round in orderedRound" :key="round.index">
        <td class="text-center">{{ round.index }}</td>
        <td class="text-center">{{ round.winner | hexSlicer }}</td>
        <td class="text-right">{{ round.reward | convertedTONFromWTON }}</td>
      </tr>
    </tbody>ㅜ
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
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

.winner-table td, .winner-table th {
  border-top: 1px solid #555561;
  /* border: 1px solid #555561; */
  /* padding: 8px; */
}

/* .winner-table tr:nth-child(even){background-color: #f2f2f2;} */

tbody tr:hover {
  background-color: #ececec;
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
  padding: 8px;
}

td {
  padding: 4px;
}
</style>
