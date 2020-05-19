<template>
  <div class="table-paginate">
    <div class="row">
      <button @click="prevPage()">
        ←
      </button>
      <div class="page">
        Page {{ currentPage }} out of {{ pages }}
      </div>
      <button @click="nextPage()">
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
  font-family: Roboto;
  font-size: 11px;
  text-align: center;
  color: #7e8d93;

  margin-top: 1px;
  margin-left: 6px;
  margin-right: 6px;
}

button {
  color: #ffffff;
  background-color: #b6b7b7;
  border: 1px solid #b6b7b7;
  text-align: center;
  border-radius: 6px;
}

button:hover {
  cursor: pointer;
}
</style>
