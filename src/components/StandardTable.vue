<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(column, index) in columns"
          :key="index"
        >
          {{ column }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(data, index) in datas"
        :key="index"
        :class="{ 'table-clickable': clickable }"
        @click="clickTableData(data)"
      >
        <td
          v-for="(value, key) in data"
          :key="key"
        >
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
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
  },
  methods: {
    clickTableData (data) {
      this.$emit('clickedTableData', data);
    },
  },
};
</script>

<style>
.table-clickable:hover {
  cursor: pointer;
  background: #f8f8f8;
}

table {
  width: 100%;
  table-layout: auto;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-spacing: 0px;
  /* border-radius: 7px; */
}

table td {
  /* border-top: 1px solid #ddd; */
  text-align: center;
}

th {
  font-size: 8px;
  height: 21px;
  /* border-top-left-radius: 7px;
  border-top-right-radius: 7px; */
  color: #7e8d93;
  font-weight: 300;
  background: #f8f8f8;
  border-bottom: 1px solid #ddd;
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
  /* border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px; */
  min-height: 240px;
  max-height: 240px;
  overflow-y: scroll;
}

thead, tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
</style>
