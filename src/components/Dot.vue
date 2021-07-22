<template>
  <div class="dot" :style="{backgroundColor: title === 'Operator'? '#73d500' : '#eb597b' }" />
</template>
<script>
export default {
  props:{
    title: {
      required: true,
      type:String,
    },
  },
};
</script>
<style scoped>
.dot {
    height: 8px;
  width: 8px;
  border-radius: 4px;
  margin-right:7px;
}
</style>
