<template>
  <div class="column">
    <label>{{ label }}</label>
    <input :value="value" @input="updateValue($event.target.value)">
    <hr>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '-',
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
}

label {
  color: #a1a1a1;
	display: block;
  font-size: 14px;
}

input {
  width: 100%;
  height: 24px;
  margin-top: 8px;
	position: relative;
  font-size: 18px;
}

hr {
  margin-top: 12px;
}
</style>
