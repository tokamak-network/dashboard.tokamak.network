<template>
  <div class="power-current-detail">
    <h3>{{ title }}</h3>
    <span class="power-current-detail-content">{{ value }}</span>
  </div>
</template>
<script>
export default {
  props:{
    title: {
      type:String,
    },
    value:{
      required: true,
    },
  },
};
</script>
<style scoped>
.power-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 130px;
}
.power-current-detail {
  display: flex;
  flex-direction: column;
  width: 256px;
  height: 51px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px 0 rgba(96, 97, 112, 0.16);
  border-radius: 10px;
  margin-left: 30px;
  padding-top: 18px;
  padding-bottom: 15px;
}
.power-current-detail h3 {
  font-size: 13px;
  color: #808992;
  font-weight: 500;
  margin-bottom: 7px;
}
.power-current-detail-content {
  font-size: 20px;
  font-weight: 500;
  color: #304156;
  font-family: Roboto;
}
</style>
