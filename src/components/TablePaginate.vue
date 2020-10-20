<template>
  <div class="table-paginate">
    <div class="row">
      <button class="paginate-button" @click="prevPage()">
        ←
      </button>
      <div class="page">
        Page {{ currentPage }} out of {{ pages }}
      </div>
      <button class="paginate-button" @click="nextPage()">
        →
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      currentPage: 1,
    };
  },
  methods: {
    prevPage () {
      if (this.currentPage === 1) {
        return;
      }
      this.currentPage = this.currentPage - 1;
      this.$emit('update-page', this.currentPage);
    },
    nextPage () {
      if (this.currentPage === this.pages) {
        return;
      }
      this.currentPage = this.currentPage + 1;
      this.$emit('update-page', this.currentPage);
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

.paginate-button {
  color: #ffffff;
  background-color: #2a72e5;
  border: 1px solid #2a72e5;
  text-align: center;
  border-radius: 6px;
}

button:hover {
  cursor: pointer;
  color: #555555;
}
button:focus {
    outline: none;
}
</style>
