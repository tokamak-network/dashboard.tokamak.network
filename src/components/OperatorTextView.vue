<template>
  <div>
    <div>{{ title }}</div>
    <div>{{ value }}</div>
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
  },
};
</script>
<style scoped></style>
