<template>
  <div class="operator-info-layout">
    <div class="operator-info-container">
      <img
        class="operator-info-image"
        src="@/assets/images/Operator.png"
        width="80"
        height="80"
      >
      <div style="flex: 1;">
        <div class="operator-name-label">
          {{ operatorByAddress($route.params.address).name }}
        </div>
        <div style="display: flex; margin-top: 16px;">
          <div class="operator-info-label">
            Operator
          </div>
          <div class="operator-info-content">
            {{ operatorByAddress($route.params.address).address }}
          </div>
        </div>
        <div style="display: flex;">
          <div class="operator-info-label">
            Website
          </div>
          <div class="operator-info-content">
            {{ operatorByAddress($route.params.address).website }}
          </div>
        </div>
      </div>
      <div class="delegate-button-container">
        <div
          class="delegate-button"
          @click="showModal(
            'delegate',
            wtonBalance.toNumber(),
            async (amount) =>
              DepositManager.deposit(operatorByAddress($route.params.address).rootchain, amount, { from: user })
          )"
        >
          Delegate
        </div>
        <div
          class="undelegate-button"
          @click="showModal(
            'undelegate',
            operatorByAddress($route.params.address).userStake.toNumber(),
            async (amount) =>
              DepositManager.requestWithdrawal(
                operatorByAddress($route.params.address).rootchain, amount, { from: user })
          )"
        >
          Undelegate
        </div>
      </div>
    </div>
    <div class="operator-info-detailed-container">
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Total stake
        </div>
        <div class="operator-info-detailed-content">
          {{ operatorByAddress($route.params.address).totalStake.toString(0) }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Operator stake
        </div>
        <div class="operator-info-detailed-content">
          {{ operatorByAddress($route.params.address).operatorStake.toString(0) }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Commit count
        </div>
        <div class="operator-info-detailed-content">
          {{ operatorByAddress($route.params.address).commitCount }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Duration
        </div>
        <div class="operator-info-detailed-content">
          {{ operatorByAddress($route.params.address).duration }}
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
      'web3',
      'user',
      'operators',
      'wtonBalance',
      'DepositManager',
    ]),
    ...mapGetters([
      'operatorByAddress',
    ]),
  },
  methods: {
    showModal (type, availableAmount) {
      const depositFunc =
        async (amount) => await this.DepositManager.deposit(
          this.operatorByAddress(this.$route.params.address).rootchain, amount, { from: this.user });

      this.$store.dispatch('showModal', {
        type,
        availableAmount,
        func: depositFunc,
      });
    },
  },
};
</script>

<style scoped>
.operator-info-layout {
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
.operator-info-container {
  display: flex;
  align-items: center;
  min-height: 100px;
}

.operator-info-image {
  margin-left: 24px;
  margin-right: 24px;
}

.operator-name-label {
  font-family: Roboto;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #586064;
  padding-top: 6px;
}

.operator-info-label {
  width: 60px;
  margin-right: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
  color: #586064;
}

.operator-info-content {
  flex: 1;
  word-break: break-all;
  padding-right: 24px;
  font-size: 12px;
  font-weight: 200;
  text-align: left;
  color: #586064;
}

.operator-info-detailed-label {
  flex: 1;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #676767;
  padding-left: 20px;
}

.operator-info-detailed-content {
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #586064;
  padding-right: 20px;
}

.operator-info-detailed-container {
  width: 100%;
  padding-top: 8px;
}

.operator-info-detailed {
  display: flex;
  align-items: center;
  height: 36px;
  border-top: solid 0.7px #ced6d9;
}
</style>
