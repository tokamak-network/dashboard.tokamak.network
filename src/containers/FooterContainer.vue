<template>
  <div class="footer">
    <div class="footer-container">
      <div class="flex-row">
        <div class="footer-name">
          ONTHER PTE.LTD.
        </div>
        <div class="footer-address">
          111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
        </div>
        <div>
          <img
            alt="Onther Mail"
            class="filter-grey mail-icon"
            src="@/assets/images/Mail.png"
            style="margin-right: 5px;"
          >
          <a
            class="footer-mail"
            href="mailto:hello@tokamak.network"
          >hello@tokamak.network</a>
        </div>
      </div>
      <div class="social-links">
        <dropup
          :items="[
            'Tokamak Netowork',
            'Original Staking',
            'Simple Staking',
            'Staking Simulator',
            'Price Dashboard',
            'Vesting Dashboard',
            'TON-WTON Swapper',
            'Developer Guide'
          ]"
          :hint="'Family site'"
          :button-type="'b'"
          :selector-type="'a'"
          class="dropdown"
          style="margin-left: 20px; width: 130px;"
          @on-selected="familyLink"
        />
        <a
          <<<<<<< HEAD
          class="footer-mail"
          href="mailto:info@onther.io"
        >hello@tokamak.network</a>
        <img
          class="filter-grey"
          src="@/assets/images/Mail.png"
          width="14;"
          height="10;"
        >
      </div>
      <div class="footer-channel-container">
        <a
          =="====="
        >>>>>>> 417b26b20c8db8cf0b6237ab22d9e3f96fd148a1
          href="https://medium.com/onther-tech/"
          target="_blank"
          rel="noopener noreferrer"
          >
          <img
            alt="Onther Medium"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/medium.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://www.linkedin.com/company/onther-tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther LinkedIN"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/linkedin.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://twitter.com/tokamak_network/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther Twitter"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/twitter.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://www.youtube.com/channel/UCF6vtIKF_0QQVRG983czVEQ/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther Youtube"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/youtube.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://www.facebook.com/OntherInc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther Facebook"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/facebook.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://github.com/Onther-Tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther GitHub"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/github.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://discord.gg/8wSpJKz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther Discord"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/discord.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://t.me/tokamak_network/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Onther Telegram"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/telegram.png"
            width="28x;"
            height="28px;"
          >
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import DropupLink from '@/components/DropupLink.vue';

export default {
  components: {
    'dropup': DropupLink,
  },
  methods: {
    familyLink (item) {
      if (item === 'Tokamak Netowork') window.open('https://tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'DAO governance') window.open('https://tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Original Staking') window.open('https://staking.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Simple Staking') window.open('https://simple.staking.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Staking Simulator') window.open('https://staking-simulator.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Price Dashboard') window.open('https://price.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Vesting Dashboard') window.open('https://vesting.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'TON-WTON Swapper') window.open('https://wton-swapper.tokamak.network', '_blank'); // eslint-disable-line
      else if (item === 'Developer Guide') window.open('https://docs.tokamak.network', '_blank'); // eslint-disable-line
    },
  },
};
</script>

<style scoped>
.footer {
  display: flex;
  height: 76px;
  align-items: center;
  justify-content: center;
  background-color: #fafbfc;
  font-family: "Titillium Web", sans-serif;
  border-top: 1px solid #f4f6f8;
  padding: 0 40px;
}

.footer-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.social-links {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  width: 30%;
}

.footer-name {
  font-weight: bold;
  font-stretch: normal;
  font-size: 14px;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #3e495c;
  margin-right: 20px;
}

.footer-address {
  font-family:  "Titillium Web", sans-serif;
  font-size: 13px;
  font-weight: lighter;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.54;
  letter-spacing: normal;
  text-align: left;
  color: #86929d;
  margin-right: 15.8px;
}

.footer-mail-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.mail-icon {
  width: 10.5px !important;
  height: 7.9px !important;
}

.footer-mail {
  font-size: 13px;
  font-weight: 300;
  letter-spacing: normal;
  text-align: left;
  color: #3d495d;
  text-decoration:none
}

.footer-channel-container {
  padding-top: 8px;
  display: flex;
  flex-direction: row-reverse;
}

.filter-grey {
  width: 20px;
  height: 20px;
  -webkit-filter: invert(30%) grayscale(100%) brightness(85%) contrast(4);
  filter: invert(30%) grayscale(100%) brightness(85%) contrast(4);
}

.footer-channel-image {
  padding-left: 4px;
}

.footer-channel-image:hover {
  cursor: pointer;
  -webkit-filter: invert(30%) grayscale(100%) brightness(70%) contrast(4);
  filter: invert(30%) grayscale(100%) brightness(70%) contrast(4);
}
</style>
