<template>
  <div class="menu-container">
    <div
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path === '/dashboard'}"
      @click="clickMenu('dashboard')"
    >
      <img
        class="menu-image"
        :class="{ 'menu-button-selected': $route.path === '/dashboard'}"
        src="@/assets/images/DashboardMenu.png"
        width="10.7"
        height="9.7"
      >
      Dashboard
    </div>
    <div
      style="margin-top: 16px;"
      class="menu-title-container"
      :class="{ 'menu-selected': $route.path !== '/dashboard'}"
      @click="clickMenu('operators')"
    >
      <img
        class="menu-image menu-button-clicked"
        :class="{ 'menu-button-selected': $route.path === '/dashboard'}"
        src="@/assets/images/StakingMenu.png"
        width="13"
        height="13"
      >
      Staking
    </div>
    <div
      class="sub-menu-title-container"
      :class="{ 'menu-selected': $route.path === '/operators'}"
      @click="clickMenu('operators')"
    >
      <div class="sub-menu-title">
        Operator List
      </div>
    </div>
    <div
      class="sub-menu-title-container"
      :class="{ 'menu-selected': $route.path === '/staking'}"
      @click="clickMenu('staking')"
    >
      <div class="sub-menu-title">
        My Staking
      </div>
    </div>
    <div
      class="sub-menu-title-container"
      :class="{ 'menu-selected': $route.path === '/history'}"
      @click="clickMenu('history')"
    >
      <div class="sub-menu-title">
        History
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    clickMenu (path) {
      this.$router.push(`/${path}`);
    },
  },
};
</script>

<style>
.menu-container {
  padding-top: 24px;
  padding-bottom: 24px;
  background: #ffffff;
  width: 260px;
  min-height: 100%;
  border-radius: 7px;
  border: solid 0.7px #ced6d9;
}

.menu-title-container {
  margin-left: 1px;
  margin-right: 1px;
  display: flex;
  align-items: center;
  padding: 10px;
  padding-left: 16px;
  text-decoration: none;
  padding-left: 8px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: normal;
  text-align: left;
  color: #c4c4c4;
}

.menu-title-container svg {
  fill: red;
}

.menu-image {
  margin-left: 5px;
  margin-right: 10px;
}

.sub-menu-title-container {
  margin-left: 1px;
  margin-right: 1px;
  padding: 10px;
  padding-left: 36px;
  text-decoration: none;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #c4c4c4;
}

.menu-title-container:hover {
  cursor: pointer;
}

.sub-menu-title-container:hover {
  cursor: pointer;
}

.menu-selected {
  background: #f7f8f9;
  color: #3e3e3e;
}

.menu-button-selected {
  filter: invert(75%);
}
</style>
