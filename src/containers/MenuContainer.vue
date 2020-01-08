<template>
  <div>
    <menu-title
      :title="'Dashboard'"
      :path="'/dashboard'"
    />
    <menu-title
      :title="'Staking'"
      :path="'/operators'"
    />
    <menu-title
      :title="'Operator List'"
      :path="'/operators'"
    />
    <menu-title
      :title="'My Staking'"
      :path="'/staking'"
    />
    <menu-title
      :title="'History'"
      :path="'/history'"
    />
  </div>
</template>

<script>
import MenuTitle from '@/components/MenuTitle.vue';

export default {
  components: {
    'menu-title': MenuTitle,
  },
};
</script>

<style>
</style>
