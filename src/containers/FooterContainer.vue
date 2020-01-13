<template>
  <div class="footer-container">
    <div>
      <div class="corporate-name">
        ONTHER.PTE.LTD
      </div>
      <div class="corporate-address">
        10 ANSON ROAD #23-140 INTERNATIONAL PLAZA SINGAPORE
      </div>
    </div>
    <div style="width: 140px;" />
    <div>
      <div class="corporate-mail">
        info.onther.io
        <img
          class="filter-grey"
          src="@/assets/images/Mail.png"
          width="15x;"
          height="12px;"
          style="padding-right: 6px;"
        >
      </div>
      <div class="corporate-channel">
        <img
          class="filter-grey channel-image"
          src="@/assets/images/Linkedin.png"
          width="28x;"
          height="28px;"
        >
        <img
          class="filter-grey channel-image"
          src="@/assets/images/Twitter.png"
          width="28x;"
          height="28px;"
        >
        <img
          class="filter-grey channel-image"
          src="@/assets/images/Youtube.png"
          width="28x;"
          height="28px;"
        >
        <img
          class="filter-grey channel-image"
          src="@/assets/images/Facebook.png"
          width="28x;"
          height="28px;"
        >
        <img
          class="filter-grey channel-image"
          src="@/assets/images/Github.png"
          width="28x;"
          height="28px;"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.footer-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: #f6f8f9;
  text-align: center;
}

.corporate-name {
  opacity: 1;
  font-family: Roboto;
  font-size: 19px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #b2b7b9;
}

.corporate-address {
  font-family: Roboto;
  font-size: 13px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #6d848e;
}

.corporate-mail {
  display: flex;
  flex-direction: row-reverse;
  font-size: 13px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #6d848e;
  align-items: center;
}

.corporate-channel {
  padding-top: 8px;
  display: flex;
  flex-direction: row-reverse;
}

.filter-grey {
  -webkit-filter: invert(30%) grayscale(100%) brightness(85%) contrast(4);
  filter: invert(30%) grayscale(100%) brightness(85%) contrast(4);
}

.channel-image {
  padding-left: 4px;
}

.channel-image:hover {
  cursor: pointer;
}
</style>
