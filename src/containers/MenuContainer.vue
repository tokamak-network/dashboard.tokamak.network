<template>
  <div class="menu-container">
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path === '/dashboard'}"
    >
      <img
        class="menu-image"
        src="@/assets/images/DashboardMenu.svg"
        width="10.7"
        height="9.7"
      >
      <router-link
        class="menu-title"
        to="/dashboard"
      >
        Dashboard
      </router-link>
    </div>
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path !== '/dashboard'}"
    >
      <img
        class="menu-image"
        src="@/assets/images/StakingMenu.svg"
        width="13"
        height="13"
      >
      <router-link
        class="menu-title"
        to="/operators"
      >
        Staking
      </router-link>
    </div>
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path === '/operators'}"
    >
      <router-link
        class="sub-menu-title"
        to="/operators"
      >
        Operator List
      </router-link>
    </div>
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path === '/staking'}"
    >
      <router-link
        class="sub-menu-title"
        to="/staking"
      >
        My Staking
      </router-link>
    </div>
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path === '/history'}"
    >
      <router-link
        class="sub-menu-title"
        to="/history"
      >
        History
      </router-link>
    </div>
    <div v-if="$route.path === path" />
  </div>
</template>

<script>
</script>

<style>
.menu-selected {
  background: #f7f8f9;
}

.menu-container {
  background: #ffffff;
  width: 235px;
  height: 100%;
  border: solid 0.7px #ced6d9;
  padding-bottom: 1px;
}

.menu-title-container {
  padding: 10px;
  padding-left: 16px;
}

.menu-title {
  text-decoration: none;
  padding-left: 8px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #3e3e3e;
}

.sub-menu-title {
  padding-left: 24px;
  text-decoration: none;
  font-family: Roboto;
  font-size: 15px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #5d5d5d;
}
</style>
