<template>
  <div class="search-bar-container">
    <input
      class="search-bar"
      type="text"
      placeholder="검색"
    >
  </div>
</template>

<script>
export default {};
</script>

<style>
.search-bar-container {
  width: 100%;
}

.search-bar {
  width: 100%;
  height: 40px;
  font-size: 14px;
  border-radius: 7px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  background-image: url("../assets/images/Search.svg");
  background-position: right;
  background-position-x: 98%;
  background-repeat: no-repeat;
  background-size: 16px 16px
}

input[type="text"] {
    box-sizing: border-box;
    padding-left: 16px;
}

input::placeholder {
  color: #aaaaaa;
}
</style>
