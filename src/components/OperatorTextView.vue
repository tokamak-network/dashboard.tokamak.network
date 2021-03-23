<template>
  <div>
    <div class="title">{{ title }}</div>
    <div v-if="tonValue" class="ton-value">
      <div class="value">{{ value }}</div>
      <div class="ton">TON</div>
    </div>
    <div v-else class="value" :class="{date:date}">{{ value }}</div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      required: true,
      type: String,
    },
    value: { required: true, type: String },
    date: { required:true, type:Boolean },
    tonValue: { required:true, type:Boolean },
  },
};
</script>
<style scoped>
.title{
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: 0.38px;
  text-align: left;
  color: #808992;
}
.value{
  margin-top: 12px;
  font-family: Roboto;
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.71;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
}
.ton-value {
  display: flex;
  flex-direction: row;
  align-items:baseline;
}
.ton{
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
  margin-left: 6px;
}
.date {
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: normal;
  text-align: left;
  color: #304156;
}
</style>
