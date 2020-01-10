<template>
  <div class="dashboard-header-container">
    <div class="wallet-info-container">
      <img
        class="wallet-info-image"
        :src="require(`@/assets/images/Account.svg`)"
      >
      <div>
        <div class="wallet-info-title">
          Account
        </div>
        <div class="wallet-info-content">
          {{ account }}
        </div>
      </div>
    </div>
    <div class="wallet-info-container">
      <img
        class="wallet-info-image"
        :src="require(`@/assets/images/Balance.svg`)"
      >
      <div>
        <div class="wallet-info-title">
          Balance
        </div>
        <div class="wallet-info-content">
          {{ balance }}
        </div>
      </div>
    </div>
    <div class="wallet-info-container">
      <img
        class="wallet-info-image"
        :src="require(`@/assets/images/Network.svg`)"
      >
      <div>
        <div class="wallet-info-title">
          Network
        </div>
        <div class="wallet-info-content">
          {{ networkId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState([
    'account',
    'networkId',
    'balance',
  ]),
};
</script>

<style>
.dashboard-header-container {
  width: 100%;
  display: flex;
  padding-bottom: 16px;
}

.wallet-info-container {
  width: 33.3%;
  display: flex;
  align-items: center;
  height: 74px;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}

.wallet-info-container:first-child {
  margin-right: 8px;
}

.wallet-info-container:last-child {
  margin-left: 8px;
}

.wallet-info-title {
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  margin-bottom: 4px;
  color: #124b71;
}

.wallet-info-content {
  font-size: 11.5px;
  line-height: 1.08;
  letter-spacing: 0.2px;
  text-align: left;
  color: #586064;
  padding-right: 17px;
  word-break: break-all;
}

.wallet-info-image {
  padding-left: 16.9px;
  padding-right: 16.9px;
}
</style>
