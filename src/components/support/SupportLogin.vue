<template>
  <div>
    <div class="title">Login</div>
    <p class="description">
      You need to login to our staking serive by connecting your wallet to the
      simple staking service to obtain access to some functionalities such as
      staking and account information. By clicking the <span style="font-weight:bold">Connect Wallet (01)</span> button on the top right of the screen you can choose how to connect to your wallet.
    </p>
    <h4 class="mini-subtitle">Connect with Metamask</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Make sure you are connected to the Ethereum Mainnet network. Then click <span style="font-weight:bold">Connect Wallet (01)</span> button and click the <span style="font-weight:bold">Metamask (02)</span> icon on the pop-up. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Click on the Metmask icon of your brower extensions list and select the account you want to connect to our serivce as below <span style="font-weight:bold">(04)</span>.
      </li>
    </ol>
    <div class="image-container">
      <img class="screenshot" src="@/assets/images/connect_wallet.jpg">
      <img class="screenshot" src="@/assets/images/metamask_screenshot_4.jpg">
    </div>
    <h4 class="mini-subtitle">Connect with WalletConnect</h4>
    <ol>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">Fist click <span style="font-weight:bold">Connect Wallet</span> button and click the WalletConnect icon on the pop-up. </li>
      <li class="description" style="margin-left:-10px; margin-bottom:10px">
        Scan the QR code that appears on the screen with a mobile application that allows you to connect to DAPPs by scanning a QR code such as the Metamask mobile app or Trust Wallet app.
      </li>
    </ol>
    <div class="image-container">
      <img class="screenshot" src="@/assets/images/wallet_connect_screenshot_1.png">
    </div>
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
  justify-content: center;
}
</style>
