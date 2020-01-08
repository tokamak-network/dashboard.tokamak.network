<template>
  <div>
    <router-link
      :to="path"
    >
      {{ title }}
    </router-link>
    <div v-if="$route.path === path" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
</style>
