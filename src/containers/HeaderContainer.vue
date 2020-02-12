<template>
  <div class="header-container">
    <div class="header">
      <div class="header-logo-container">
        <img
          class="header-logo"
          src="@/assets/images/Tokamak.png"
          width="230"
          height="23"
        >
      </div>
      <div class="header-link-container">
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="http://your_url_here.html"
        >Buy TON</a>
        <a
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="http://your_url_here.html"
        >GUIDE</a>
        <a
          style="margin-right: 32px;"
          class="header-link"
          target="_blank"
          rel="noopener noreferrer"
          href="http://your_url_here.html"
        >FAQs</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.header {
  width: 960px;
  height: 100%;
  align-items: center;
  display: flex;
}

.header-logo-container {
  flex: 1;
}

.header-logo {
  margin-top: 7px;
  padding-left: 16px;
}

.header-link-container {
  width: 340px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-link:hover {
  color: #141414b0;
}

.header-link {
  text-decoration: none;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #7e8d93;
}
</style>
