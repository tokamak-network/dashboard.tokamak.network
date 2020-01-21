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
          <div class="wallet-info-content">
            {{ account }}
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
          <div class="wallet-info-content">
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
        <div class="wallet-content">
          {{ balance }}
        </div>
        <div class="wallet-content">
          <toggle-switch
            :checked="tonUnlocked"
            :func="tonUnlocked ? lockTON : unlockTON"
          />
        </div>
      </div>
      <div class="wallet-assets-content">
        <div class="wallet-content">
          WTON
        </div>
        <div class="wallet-content">
          {{ balance }}
        </div>
        <div class="wallet-content">
          <toggle-switch
            :checked="wtonUnlocked"
            :func="wtonUnlocked ? lockWTON : unlockWTON"
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
      tonUnlocked: true,
      wtonUnlocked: false,
    };
  },
  computed: mapState([
    'account',
    'networkId',
    'balance',
  ]),
  beforeCreate () {
    // TODO: check if ton and wton is unlocked.
  },
  methods: {
    lockTON () {
      alert('1');
    },
    unlockTON () {
      alert('2');
    },
    lockWTON () {
      alert('3');
    },
    unlockWTON () {
      alert('4');
    },
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
  font-size: 13px;
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
