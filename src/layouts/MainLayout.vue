<template>
  <div class="main-layout">
    <menu-container />
    <div class="content-container">
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
.main-layout {
  width: 100%;
  display: flex;
}

.content-container {
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
}
</style>
