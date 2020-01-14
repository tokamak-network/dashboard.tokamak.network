<template>
  <div class="stake-info">
    <img
      src="@/assets/images/Operator.png"
      width="36"
      height="36"
    >
    <div class="staking-operator-name">
      Onther Operator
    </div>
    <div style="flex: 1" />
    <div class="staking-token-amount">
      1000
    </div>
    <div class="staking-token-unit">
      TON
    </div>
    <div
      class="staking-claim-button"
      @click="showModal"
    >
      CLAIM
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    showModal () {
      this.$store.dispatch('showModal', 'claim');
    },
  },
};
</script>

<style>
.stake-info {
  height: 50px;
  padding-left: 16px;
  padding-right: 20px;
  display: flex;
  align-items: center;
}

.staking-operator-name {
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #586064;
  margin-left: 8px;
}

.staking-token-amount {
  font-size: 14px;
  padding-bottom: 2px;
  font-weight: 500;
  text-align: left;
  color: #586064;
  margin-right: 2px;
}

.staking-token-unit {
  font-size: 10px;
  font-weight: 300;
  text-align: left;
  color: #586064;
  margin-right: 6px;
}

.staking-claim-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 61px;
  height: 19px;
  border-radius: 3px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  font-size: 9px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #586064;
}

.staking-claim-button:hover {
  cursor: pointer;
  cursor: pointer;
  background-color: #f7f8f9;
}
</style>
