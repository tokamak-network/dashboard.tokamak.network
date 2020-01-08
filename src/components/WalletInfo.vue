<template>
  <div class="wallet-info">
    <img :src="require(`@/assets/images/${title}.svg`)">
    <div>
      <div>
        {{ title }}
      </div>
      <div>
        {{ info }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
.wallet-info {
  display: flex;
  height: 71px;
  border-radius: 11px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
</style>
