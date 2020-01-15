<template>
  <div class="header-container">
    <div class="container_12 header-content-container">
      <div class="header-logo">
        <img
          style="margin-top: 8px;"
          src="@/assets/images/Tokamak.png"
          width="258"
          height="25"
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

<style>
.header-container {
  width: 100%;
  background: #ffffff;
}

.header-content-container {
  display: flex;
  height: 60px;
  align-items: center;
}

.header-logo {
  width: 80%;
}

.header-link-container {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-link:hover {
  color: #141414b0;
}

.header-link {
  text-decoration: none;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #7e8d93;
}
</style>
