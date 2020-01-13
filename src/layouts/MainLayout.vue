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
  height: 100%;
  padding-top: 16px;
  display: flex;
}

.content-container {
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  position: relative;
}
</style>
