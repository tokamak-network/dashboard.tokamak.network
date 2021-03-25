<template>
  <div class="table-paginate">
    <div class="row">
      <button class="paginate-button-left" @click="prevPage()" />
      <div v-if="!pages || pages.length === 0" class="page">1</div>
      <div v-for="(page, index) in pages" v-else :key="index"
           class="page" :class="{ 'page-selected': page === currentPage }"
           @click="select(page)"
      >
        {{ page+1 }}
      </div>
      <button class="paginate-button-right" @click="nextPage()" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      currentPage: 0,
      pageSize: 5,
      pages: [],
    };
  },
  computed: {
    pageMax () {
      return parseInt(((this.datas.length) - 1) / 5 + 1);
    },
  },
  watch: {
    currentPage (page) {
      this.$emit('on-selected', page);
    },
    pageMax () {
      const num = this.pageMax > 5 ? this.pageSize : this.pageMax;
      this.pages = Array.from(Array(num).keys());
    },
  },
  mounted () {
    const num = this.pageMax > 5 ? this.pageSize : this.pageMax;
    this.pages = Array.from(Array(num).keys());
  },
  methods: {
    prevPage () {
      if (this.currentPage === 0) {
        return;
      }
      if (this.currentPage % this.pageSize === 0) {

        this.pages = [];
        const page = this.currentPage - 5;
        for (let i = 0; i < 5; i++) {
          this.pages.push(page + i);
        }
      }
      this.currentPage--;
    },
    nextPage () {
      if (this.pageMax === 0 || this.currentPage === this.pageMax - 1) {
        return;
      }
      if (this.currentPage % this.pageSize === this.pageSize - 1) {
        this.pages = [];
        for (let page = this.currentPage + 1; page < this.pageMax && this.pages.length < this.pageSize; page++) {
          this.pages.push(page);
        }
      }
      this.currentPage++;
    },
    select (page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.table-paginate {
  margin-top: -6px;
  margin-bottom: 12px;
  width: 100%;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.page {
  font-family: "Noto Sans",sans-serif;
  font-size: 13px;
  text-align: center;
  color: #868686;

  margin-top: 1px;
  margin-left: 6px;
  margin-right: 6px;
}

.paginate-button-left, .paginate-button-right {
  color: #ffffff;
  border: 1px solid #e6eaee;
  text-align: center;
  border-radius: 6px;
  height: 24px;
  width: 24px;
  background-color: #ffffff;
}
.paginate-button-left {
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('../assets/images/Pagenate_prev_arrow_icon_inactive.png');
}
.paginate-button-right {
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('../assets/images/Pagenate_next_arrow_icon_inactive.png');
}
.paginate-button-left:hover {
  border: 1px solid #257eee;
  cursor: pointer;
 background-position: center;
  background-repeat: no-repeat;
  background-image:url('../assets/images/Pagenate_prev_arrow_icon_active.png');
}
.paginate-button-right:hover {
  border: 1px solid #257eee;
  cursor: pointer;
 background-position: center;
  background-repeat: no-repeat;
  background-image:url('../assets/images/Pagenate_next_arrow_icon_active.png');
}
button:focus {
    outline: none;
}
.page {
  width: 24px;
  height: 24px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: center;
  color: #94a5b7;
}
.page:hover {
  color: #2a72e5;
  cursor: pointer;
}
.page-selected {
  color: #2a72e5;
}
</style>
