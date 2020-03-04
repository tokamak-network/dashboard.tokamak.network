<template>
  <div class="operator-info-layout">
    <div class="operator-info-container">
      <div>
        <div class="operator-name-label">
          {{ operator.name }}
        </div>
        <div style="display: flex; margin-top: 8px;">
          <div class="operator-info-label">
            Operator
          </div>
          <div class="operator-info-content">
            {{ operator.address }}
          </div>
        </div>
        <div style="display: flex;">
          <div class="operator-info-label">
            Website
          </div>
          <div class="operator-info-content">
            {{ operator.website }}
          </div>
        </div>
      </div>
    </div>
    <div class="operator-info-detailed-container">
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Total Reward
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.totalStake }}
          <!-- TODO: calculate total reward -->
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Total Deposit
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.totalDeposit | convertToTON }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Total Stake
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.totalStake | convertToTON }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Operator Deposit
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.operatorDeposit | convertToTON }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Operator Stake
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.operatorStake | convertToTON }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Reward (totalStake / totalDeposit)
        </div>
        <div class="operator-info-detailed-content">
          {{ calculateReward() }} %
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Commit Count
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.commitCount }}
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Duration
        </div>
        <div class="operator-info-detailed-content">
          {{ operator.duration | fromNow }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';


export default {
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    calculateReward () {
      try {
        return (this.operator.totalStake.div(this.operator.totalDeposit)).toNumber();
      } catch (e) {
        return 0;
      }
    },
  },
};
</script>

<style scoped>
.operator-info-layout {
  height: 100%;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
}
.operator-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 16px;
  margin-right: 16px;
}

.operator-info-image {
  margin-left: 16px;
  margin-right: 16px;
  width: 65px;
  height: 65px;
}

.operator-name-label {
  font-family: Roboto;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
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
}

.operator-info-detailed {
  display: flex;
  align-items: center;
  height: 36px;
  border-top: solid 0.7px #ced6d9;
}
</style>
