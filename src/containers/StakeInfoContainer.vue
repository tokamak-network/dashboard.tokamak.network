<template>
  <div class="stake-info-container">
    <div class="operator-info-container">
      <img
        class="operator-image"
        src="@/assets/images/Operator.png"
        width="60"
        height="60"
      >
      <div class="operator-name">
        TOKAMAK NETWORK
      </div>
      <div class="staking-amount">
        1000
      </div>
      <div class="staking-amount-unit">
        TON
      </div>
      <div
        class="claim-button"
        @click="showModal('claim')"
      >
        Claim
      </div>
    </div>
    <div class="division-line" />
    <div
      class="operator-detailed-info-container"
    >
      <div class="operator-detailed-info">
        <div class="operator-address">
          0x005BcC8EFd30Df0044AC0787268513ACe542afaA
        </div>
        <div style="display: flex;">
          <div class="block-number">
            Block #1222
          </div>
          <div class="last-commit">
            Last commit: 10 minutes ago
          </div>
        </div>
        <div class="uncommitted-rewards">
          Uncommitted rewards : 100 TON
        </div>
      </div>
      <div class="delegate-button-container">
        <div
          class="delegate-button"
          @click="showModal('delegate')"
        >
          Delegate
        </div>
        <div
          class="undelegate-button"
          @click="showModal('undelegate')"
        >
          Undelegate
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showModal (type) {
      this.$store.dispatch('showModal', type);
    },
  },
};
</script>

<style scoped>
.stake-info-container {
  width: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  margin-top: 8px;
}

.operator-image {
  margin-left: 20px;
}

.operator-info-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
}

.operator-name {
  width: 100%;
  margin-left: 20px;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #586064;
}

.staking-amount {
  padding-top: 4px;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #586064;
}

.staking-amount-unit {
  margin-left: 4px;
  padding-top: 4px;
  font-size: 18px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #586064;
}

.claim-button {
  margin-left: 10px;
  margin-right: 20px;
  width: 121px;
  height: 27px;
  line-height: 27px;
  border-radius: 7px;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  border: solid 1px #dce2e5;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #124b71;
}

.claim-button:hover {
  cursor: pointer;
  -webkit-filter: opacity(.7);
  filter: opacity(.7);
}

.division-line {
  width: 100%;
  height: 2px;
  background: #dce2e5;
}

.operator-detailed-info-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.operator-detailed-info {
  width: 100%;
}

.operator-address {
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.09;
  letter-spacing: 0.33px;
  text-align: left;
  color: #586064;
}

.block-number {
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  margin-right: 8px;
  font-style: normal;
  line-height: 2.09;
  letter-spacing: 0.33px;
  text-align: left;
  color: #124b71;
}

.last-commit {
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.09;
  letter-spacing: 0.33px;
  text-align: left;
  color: #797979;
}

.uncommitted-rewards {
  font-size: 10px;
  font-weight: 300;
  font-stretch: normal;
  font-style: italic;
  line-height: 2.3;
  letter-spacing: 0.3px;
  text-align: left;
  color: #8e8e8e;
}
</style>
