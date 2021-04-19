<template>
  <div>
    <div class="title">Install Metamask</div>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Please install the Metamask extension on your
        <a
          class="link"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="blank"
        >
          Google Chrome
        </a>
        or
        <a
          class="link"
          href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
          target="blank"
        >Firefox</a>
        browser if you would like to connect to our service with Metamask. If your TON is already in a Metamask wallet, please login to
        that wallet, or import an account that already has TON.
        <div class="image-container">
          <img class="screenshot" style="width:60%" src="@/assets/images/metamask_chrome.png">
          <img class="screenshot" style="width:30%" src="@/assets/images/metamask_firefox.png">
        </div>
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        To add TON on your wallet, make sure you're connected to the <span style="font-weight:bold">Ethereum Mainnet</span> network. Then click the
        <span style="font-weight:bold">Add Token</span> button.
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Click the <span style="font-weight:bold">Custom Token</span> tab.
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Insert contract address as shown in the image below. The Token Symbol and Decimals of Precision will be filled automatically.
        <ul>
          <li class="description" style="margin-left:-10px; margin-top:10px">Token Contract Address: <span style="font-weight:bold">0x2be5e8c109e2197D077D13A82dAead6a9b3433C5</span></li>
        </ul>
      </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Click the <span style="font-weight:bold">Next </span> button </li>

      <li class="description" style="margin-left:-10px; margin-bottom:10px"> <span style="font-weight:bold">Add Tokens</span> button in the next screen to add TON to your account.</li>
      <div class="image-container">
        <img class="screenshot" src="@/assets/images/support/metamask_01.png">
        <img class="screenshot" src="@/assets/images/support/metamask_02.png">
        <img class="screenshot" src="@/assets/images/support/metamask_03.png">
      </div>
    </ol>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.title {
  font-family: Roboto;
  font-size: 22px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.2px;
  text-align: left;
  color: #2a72e5;
  margin-bottom: 20px;
  margin-top: 40px;
}
.subtitle {
  font-family: Roboto;
  font-size: 18px;
  font-weight: 700;
  color: #3d495d;
}
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
.screenshot {
  width: 25%;
  height: 30%;
  margin: 30px;
  box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
.mini-subtitle {
  font: Roboto;
  font-size: 18px;
  color: #2a72e5;
  font-weight: normal;
}
.link {
  font-family: Roboto;
  font-size: 17px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.41;
  letter-spacing: 0.34px;
  text-align: left;
  color: #2a72e5;
}
.image-container {
    display: flex;
    flex-direction: row;
     align-items: center;
    justify-content: center;
}
</style>
