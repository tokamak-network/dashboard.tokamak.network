<template>
  <div>
    <menu-container class="grid_3" />
    <div class="grid_9">
      <dashboard-header-container />
      <router-view />
    </div>
  </div>
</template>

<script>
import DashboardHeaderContainer from '@/containers/DashboardHeaderContainer.vue';
import MenuContainer from '@/containers/MenuContainer.vue';

export default {
  components: {
    'menu-container': MenuContainer,
    'dashboard-header-container': DashboardHeaderContainer,
  },
};
</script>

<style>
</style>
