<template>
  <table>
    <thead>
      <th
        v-for="column in columns"
        :key="column.name"
        :class="{ 'round': rounded }"
      >
        {{ column.name }}
      </th>
    </thead>
    <tbody
      :class="{ 'round': rounded }"
    >
      <tr
        v-for="data in datas"
        :key="getKey(data)"
        :class="{ 'table-clickable': clickable }"
        @click="clickTableData(data)"
      >
        <td
          v-for="column in columns"
          :key="column.name"
        >
          {{ filtered(column.key, data[column.key], data) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    datas: {
      type: Array,
      default: () => [],
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clickTableData (data) {
      this.$emit('tableDataClicked', data);
    },
    getKey (data) {
      switch (this.type) {
      case 'operator':
        return data.rootchain;
      }
    },
    filtered (key, data) {
      switch (this.type) {
      case 'operator':
        if (key === 'address' || key === 'rootchain') return this.$options.filters.hexSlicer(data);
        else if (key === 'totalStaked' || key === 'userStaked') return this.$options.filters.convertedTONFromWTON(data);
        else if (key === 'recentCommitTimestamp') return this.$options.filters.fromNow(data);
        else return data;

      case 'history':
        if (key === 'transactionHash') return this.$options.filters.hexSlicer(data);
        else if (key === 'amount') return this.$options.filters.stringToTON(data);
        else return data;

      default:
        return data;
      }
    },
  },
};
</script>

<style scoped>
.table-clickable:hover {
  cursor: pointer;
  background: #f8f8f8;
}

table {
  width: 100%;
  table-layout: auto;
  border-spacing: 0px;
}

table.round {
  border-radius: 6px;
}

table td {
  text-align: center;
}

th {
  font-size: 8px;
  height: 21px;
  color: #7e8d93;
  font-weight: 300;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

th.round:first-child {
  border-top-left-radius: 7px;
}

th.round:last-child {
  border-top-right-radius: 7px;
}

td {
  height: 36px;
  font-size: 13px;
  font-weight: 300;
  color: #586064;
}

tbody {
  background: #ffffff;
  display: block;
  min-height: 240px;
  max-height: 240px;
  overflow-y: scroll;
}

tbody.round {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

thead, tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
</style>
