<template>
  <div class="header-container">
    <div class="container_12 header-content-container">
      <div class="header-logo">
        <img
          src="@/assets/images/Tokamak.jpg"
          width="313"
          height="31"
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
  width: 100%;
}

.header-link-container {
  width: 400px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
}

.header-link {
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: #707070;
}
</style>
