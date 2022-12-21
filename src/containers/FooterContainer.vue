<template>
  <div class="footer">
    <div class="footer-container">
      <div class="flex-row">
        <div class="footer-name">
          Tokamak Network PTE.LTD.
        </div>
        <!-- <div class="footer-address">
          111 SOMERSET ROAD #06-07O 111 SOMERSET SINGAPORE 238164
        </div> -->
        <div>
          <img
            alt="Tokamak Network Mail"
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
      </div>
      <div class="footer-channel-container">
        <a
          href="https://medium.com/Tokamak Network-tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Tokamak Network Medium"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/medium.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://www.linkedin.com/company/Tokamak Network-tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Tokamak Network LinkedIN"
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
            alt="Tokamak Network Twitter"
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
            alt="Tokamak Network Youtube"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/youtube.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://www.facebook.com/Tokamak NetworkInc/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Tokamak Network Facebook"
            class="footer-channel-image filter-grey"
            src="@/assets/images/community/facebook.png"
            width="28x;"
            height="28px;"
          >
        </a>
        <a
          href="https://github.com/Tokamak Network-Tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Tokamak Network GitHub"
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
            alt="Tokamak Network Discord"
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
            alt="Tokamak Network Telegram"
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
      else if (item === 'Swapper') window.open('https://swap.tokamak.network', '_blank'); // eslint-disable-line
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
  width: 100%;
}

.footer-container {
 margin: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
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
