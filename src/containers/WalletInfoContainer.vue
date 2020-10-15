<template>
  <div class="wallet-info-container">
    <div class="wallet-basic-info-container">
      <div class="wallet-info">
        <img
          width="30"
          height="30"
          class="wallet-info-image"
          :src="require(`@/assets/images/Account.svg`)"
        >
        <div>
          <div class="wallet-info-title">
            Account
          </div>
          <div class="wallet-info-content account">
            {{ user }}
          </div>
        </div>
      </div>
      <div class="wallet-info">
        <img
          width="30"
          height="30"
          class="wallet-info-image"
          :src="require(`@/assets/images/Network.svg`)"
        >
        <div>
          <div class="wallet-info-title">
            Network
          </div>
          <div class="row">
            <div class="wallet-info-content">
              {{ networkId | nameOfNetwork }}
            </div>
            <div class="wallet-info-content block-number">
              (Block: {{ blockNumber }})
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wallet-assets-info-container">
      <div class="wallet-assets-info">
        <img
          class="wallet-info-image"
          :src="require(`@/assets/images/Balance.svg`)"
        >
        <div style="display: flex;">
          <div
            class="wallet-info-title"
            style="margin-right: 200px;"
          >
            Assets
          </div>
        </div>
      </div>
      <div class="wallet-assets-header">
        <div class="wallet-header">
          ASSET
        </div>
        <div class="wallet-header">
          AMOUNT
        </div>
      </div>
      <div class="wallet-assets-content">
        <div class="wallet-content">
          TON
        </div>
        <div class="wallet-content ton-balance">
          {{ tonBalance | currencyAmount }}
        </div>
      </div>
      <div class="wallet-assets-content">
        <div class="wallet-content">
          Total Staked
        </div>
        <div class="wallet-content wton-balance">
          {{ userTotalStaked | currencyAmount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState([
      'user',
      'networkId',
      'tonBalance',
      'blockNumber',
    ]),
    ...mapGetters([
      'userTotalStaked',
    ]),
  },
};
</script>

<style scoped>
.wallet-info-container {
  width: 100%;
  display: flex;
  padding-bottom: 16px;
}

.row {
  display: flex;
  flex-direction: row;
}

.block-number {
  margin-left: 4px;
}

.wallet-basic-info-container {
  flex: 1;
  margin-right: 4px;
}

.wallet-assets-info-container {
  padding-top: 16px;
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-height: 100%;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}

.wallet-info {
  display: flex;
  align-items: center;
  height: 74px;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}

.wallet-info:first-child {
  margin-bottom: 8px;
}

.wallet-info:last-child {
  margin-top: 8px;
}

.wallet-assets-info {
  display: flex;
  align-items: center;
}

.wallet-assets-header {
  margin-top: 12px;
  margin-bottom: 8px;
  display: flex;
  width: 100%;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.wallet-header {
  font-family: "Noto Sans",sans-serif;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 50%;
  text-align: center;
  color: #586064;
  font-size: 11px;
}

.wallet-assets-content {
  display: flex;
  width: 100%;
  height: 100%;
}

.wallet-content {
  margin-top: 4px;
  margin-bottom: 2px;
  width: 50%;
  text-align: center;
  font-size: 12px;
  font-family: "Noto Sans",sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: 0.27px;
  color: #586064;
}

.wallet-info-title {
  font-family: "Noto Sans",sans-serif;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  margin-bottom: 4px;
  color: #124b71;
}

.wallet-info-content {
  text-align: left;
  font-size: 12.5px;
  font-family: "Noto Sans",sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: 0.27px;
  color: #586064;
  word-break: break-all;
}

.wallet-info-image {
  padding-left: 16.9px;
  padding-right: 16.9px;
}
</style>
