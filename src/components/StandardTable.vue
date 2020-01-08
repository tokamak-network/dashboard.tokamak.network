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
      >
        <td
          v-for="column in columns"
          :key="column.title"
        >
          {{ data }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data () {
    return {
      columns: ['NO', 'ADDRESS', 'NAME', 'RECENT COMMIT TIMESTAMP', 'COMMISSION RATE'],
      datas: [
        {
          title: 'test1',
        },
        {
          title: 'test2',
        },
        {
          title: 'test3',
        },
        {
          title: 'test4',
        },
        {
          title: 'test5',
        },
      ],
    };
  },
};
</script>

<style>
table {
  border: 1px solid #ddd;
  border-radius: 6px;
  border-spacing: 0px;
  table-layout: auto;
  width: 100%;
}

table td {
  border-top: 1px solid #ddd;
  text-align: center;
}

/* table td,
table th {
  padding: 10px;
} */

th {
  height: 40px;
  font-size: 9px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.89;
  letter-spacing: normal;
  text-align: center;
  color: #005fa9;
  background: #f8f8f8;
}

td {
  height: 36px;
  font-family: Roboto;
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #586064;
}
</style>
