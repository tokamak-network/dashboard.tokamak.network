<template>
  <div class="current-detail">
    <h3>{{ title }}</h3>
    <span v-if="ton" class="current-detail-content">{{ value }}<span class="current-detail-span"> TON</span></span>
    <span v-else class="current-detail-content">{{ value }}</span>
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
    ton:{
      type: Boolean,
      required: true,
    },
  },
};
</script>
<style scoped>

.current-detail {
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
.current-detail h3 {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: 0.33px;
  text-align: center;
  color: #808992;
  margin-bottom: 7px;
}
.current-detail-content {
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: right;
  color: #304156;
}
.current-detail-span {
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
}
</style>
