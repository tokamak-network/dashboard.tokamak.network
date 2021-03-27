<template>
  <div class="button-step">
    <button @click="click">
      <img v-if="type === 'prev'"
           class="prev"
           src="@/assets/images/prev-arrow-icon.png" alt="" width="8" height="9"
      >
      <img v-if="type === 'next'"
           class="next"
           src="@/assets/images/next-arrow-icon.png" alt="" width="8" height="9"
      >
    </button>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  extends: Button,
  props: {
    type: {
      type: String,
      default: '',
      validator: (value) => {
        return [
          'prev',
          'next',
        ].indexOf(value) !== -1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.button-step {
  width: 100%;
}
button {
  width: 100%;
  height: 24px;

  border-radius: 4px;
  border: solid 1px #dfe4ee;
  background-color: #ffffff;

  outline: none;
}
button:hover {
  cursor: pointer;
  border: solid 1px #2a72e5;
}
button:hover span {
  color: #2a72e5;
}
button:hover img {
  filter: brightness(50%);
}

span {
  font-family: Roboto;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #86929d;
}
</style>
