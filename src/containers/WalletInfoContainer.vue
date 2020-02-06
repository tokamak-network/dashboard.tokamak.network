<template>
  <div class="wallet-info-container">
    <div class="wallet-basic-info-container">
      <div class="wallet-info">
        <img
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
          class="wallet-info-image"
          :src="require(`@/assets/images/Network.svg`)"
        >
        <div>
          <div class="wallet-info-title">
            Network
          </div>
          <div class="wallet-info-content network-id">
            {{ networkId }}
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
        <div>
          <div class="wallet-info-title">
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
        <div class="wallet-header">
          UNLOCK
        </div>
      </div>
      <div class="wallet-assets-content">
        <div class="wallet-content">
          TON
        </div>
        <div class="wallet-content ton-balance">
          {{ tonBalance.toNumber() }}
        </div>
        <div class="wallet-content">
          <toggle-switch
            :checked="tonUnlocked"
            :check="unlockTON"
            :uncheck="lockTON"
          />
        </div>
      </div>
      <div class="wallet-assets-content">
        <div class="wallet-content">
          WTON
        </div>
        <div class="wallet-content wton-balance">
          {{ wtonBalance.toNumber() }}
        </div>
        <div class="wallet-content">
          <toggle-switch
            :checked="wtonUnlocked"
            :check="unlockWTON"
            :uncheck="lockWTON"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import ToggleSwitch from '@/components/ToggleSwitch.vue';

export default {
  components: {
    'toggle-switch': ToggleSwitch,
  },
  data () {
    return {
      tonLocked: false,
      wtonLocked: false,

      lockTON: () => {},
      unlockTON: () => {},
      lockWTON: () => {},
      unlockWTON: () => {},
    };
  },
  computed: mapState([
    'user',
    'networkId',
    'TON',
    'WTON',
    'DepositManager',
    'tonBalance',
    'wtonBalance',
    'tonAllowance',
    'wtonAllowance',
  ]),
  created () {
    this.tonUnlocked =
      parseInt(this.tonAllowance.toNumber()) >= parseInt(this.tonBalance.toNumber()) ||
      parseInt(this.tonBalance.toNumber()) === 0;
    this.wtonUnlocked =
      parseInt(this.wtonAllowance.toNumber()) >= parseInt(this.wtonBalance.toNumber()) ||
      parseInt(this.wtonBalance.toNumber()) === 0;

    this.lockTON = async () => {
      const tx = await this.TON.approve(this.DepositManager.address, 0, { from: this.user });
      console.log(`
      call lockTON func

      result: ${tx}
      `);
    };
    this.unlockTON = async () => {
      const tx =
        await this.TON.approve(this.DepositManager.address, this.tonBalance.toFixed('wei'), { from: this.user });
      console.log(`
      call unlockTON func

      result: ${tx}
      `);
    };
    this.lockWTON = async () => {
      const tx = await this.WTON.approve(this.DepositManager.address, 0, { from: this.user });
      console.log(`
      call lockWTON func

      result: ${tx}
      `);
    };
    this.unlockWTON = async () => {
      const tx =
        await this.WTON.approve(this.DepositManager.address, this.wtonBalance.toFixed('ray'), { from: this.user });
      console.log(`
      call unlockWTON func

      result: ${tx}
      `);
    };
  },
};
</script>

<style scoped>
.wallet-info-container {
  width: 100%;
  display: flex;
  padding-bottom: 16px;
}

.wallet-basic-info-container {
  width: 40%;
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
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}

.wallet-info {
  display: flex;
  align-items: center;
  height: 74px;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
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
  margin-top: 4px;
  margin-bottom: 4px;
  width: 33.3%;
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
  width: 33.3%;
  text-align: center;
  font-size: 12px;
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
