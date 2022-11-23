<template>
  <div class="mobile-container">
    <img src="@/assets/mobile/Logo.svg">
    <span class="notice-text">Mobile will be available soon</span>
    <img src="@/assets/mobile/TN_logo.svg" class="footer">
  </div>
</template>

<script>
export default {};
</script>

<style>
.mobile-container {
  display: flex;
  flex-direction: column;
  width: 100vh;
  min-height: 100vh;
  background-color: #2a72e5;
  align-items: center;
  justify-content: center;
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
</style>
