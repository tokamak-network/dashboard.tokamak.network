<template>
  <div class="base-tab">
    <button class="left-tab" :class="{ 'left-tab-clicked': tab === 'left' }" @click="onTabChanged('left')">
      {{ leftLabel }}
    </button>
    <button class="right-tab" :class="{ 'right-tab-clicked': tab === 'right' }" @click="onTabChanged('right')">
      {{ rightLabel }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    leftLabel: {
      type: String,
    },
    rightLabel: {
      type: String,
    },
    tab: {
      type: String,
    },
  },
  methods: {
    onTabChanged (tab) {
      this.$emit('tab-changed', tab);
    },
  },
};
</script>

<style scoped>
.base-tab {
  display: flex;
  flex-direction: row;
}

button {
  width: 90px;
  line-height: 2;
  font-size: 14px;
  text-align: center;
  color: #000000;
}

button:hover {
  cursor: pointer;
  background-color: #ecf1f3;
}

.left-tab {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  z-index: 2;
}

.left-tab-clicked {
  background-color: #2868af;
  color: #ffffff;
  z-index: 2;
}

.left-tab-clicked:hover {
  background-color: #1e4e85;
  color: #ffffff;
}

.right-tab {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.right-tab-clicked {
  background-color: #f38777;
  color: #ffffff;
  z-index: 2;
}

.right-tab-clicked:hover  {
  background-color: #f06752;
  color: #ffffff;
}
</style>
