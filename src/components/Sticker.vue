<template>
  <div :style="{backgroundColor: title === 'Operator'? '#fc0324' : '#1803fc' }">
    <div>
      {{ title }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      required: true,
      type: String,
    },
  },
};
</script>
<style scoped></style>
