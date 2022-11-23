<template>
  <div class="mobile-container">
    <Mobile-Tokamak-GNB />
    <div class="logo-container">
      <img src="@/assets/mobile/Logo.svg">
      <span class="notice-text">Mobile will be available soon</span>
    </div>
    <div class="footer-container">
      <img src="@/assets/mobile/TN_logo.svg" class="footer">
    </div>
  </div>
</template>

<script>
import MobileTokamakGNB from '../containers/MobileTokamakGNB.vue';

export default {
  components: {
    'Mobile-Tokamak-GNB': MobileTokamakGNB,

  },
};
</script>

<style>
.mobile-container {
  display: flex;
  flex-direction: column;
  background-color: #2a72e5;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh !important;
}
.notice-text {
  font-size: 14px;
  color: #fff;
  margin-top: 25px;
}
.footer {
  position: absolute;
  bottom: 20px;
}

.logo-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.footer-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
</style>
