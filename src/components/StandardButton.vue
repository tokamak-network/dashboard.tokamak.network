<template>
  <div
    class="button"
    :class="{ 'disable': disable }"
    @click="click"
  >
    {{ label }}
  </div>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: false,
    },
    func: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    click () {
      if (!this.disable) {
        this.func();
      }
    },
  },
};
</script>

<style scoped>
.button {
  width: 100%;
  height: 100%;
}

.button:hover {
  cursor: pointer;
}

.disable:hover {
  cursor: not-allowed;
}
</style>
