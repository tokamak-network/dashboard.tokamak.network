<template>
  <div style="display: flex;">
    <div
      class="operator-info-layout"
      style="flex: 1; margin-right: 4px;"
    >
      <div class="operator-info-container">
        <img
          class="operator-info-image"
          src="@/assets/images/Operator.png"
          width="80"
          height="80"
        >
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
      <!-- <div class="delegate-button-container">
        <div class="delegate-button">
          <standard-button
            :label="'Delegate'"
            :func="delegate()"
            :disable="isTxProcessing('delegate')"
          />
        </div>
        <div class="undelegate-button">
          <standard-button
            :label="'Undelegate'"
            :func="undelegate()"
            :disable="isTxProcessing('undelegate')"
          />
        </div>
      </div> -->
      </div>
      <div class="operator-info-detailed-container">
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            Total Reward
          </div>
          <div class="operator-info-detailed-content">
            {{ operator.totalStake.sub(operator.totalDeposit) | convertToTON }}
          </div>
        </div>
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            Total deposit
          </div>
          <div class="operator-info-detailed-content">
            {{ operator.totalDeposit | convertToTON }}
          </div>
        </div>
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            Total stake
          </div>
          <div class="operator-info-detailed-content">
            {{ operator.totalStake | convertToTON }}
          </div>
        </div>
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            operator deposit
          </div>
          <div class="operator-info-detailed-content">
            {{ operator.operatorDeposit | convertToTON }}
          </div>
        </div>
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            operator stake
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
            {{ (operator.totalStake.div(operator.totalDeposit)).toNumber() }} %
          </div>
        </div>
        <div class="operator-info-detailed">
          <div class="operator-info-detailed-label">
            Commit count
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
    <delegate-manager
      style="flex: 1; margin-left: 4px;"
      :operator="operator"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import DelegateManager from '@/components/DelegateManager.vue';
import StandardButton from '@/components/StandardButton.vue';

export default {
  components: {
    // 'standard-button': StandardButton,
    'delegate-manager': DelegateManager,
  },
  computed: {
    ...mapState([
      'user',
      'operators',
      'wtonBalance',
      'DepositManager',
    ]),
    ...mapGetters([
      'operatorByAddress',
      'isTxProcessing',
    ]),
    operator: function () {
      return this.operatorByAddress(this.$route.params.address);
    },
  },
  methods: {
    delegate (type, availableAmount) {
      return () => {
        const type = 'delegate';
        const availableAmount = this.wtonBalance.toNumber();
        const delegateFunc =
          async (amount) => await this.DepositManager.deposit(
            this.operator.rootchain, amount, { from: this.user });

        this.$store.dispatch('showModal', {
          type,
          availableAmount,
          func: delegateFunc,
        });
      };
    },
    undelegate (type, availableAmount) {
      return () => {
        const type = 'undelegate';
        const availableAmount = this.operator.userStake.toNumber();
        const requestWithdrawalFunc =
          async (amount) => await this.DepositManager.requestWithdrawal(
            this.operator.rootchain,
            amount,
            { from: this.user }
          );
        const processRequestFunc =
          async () => await this.DepositManager.processRequest(
            this.operator.rootchain,
            true,
            { from: this.user }
          );

        this.$store.dispatch('showModal', {
          type,
          availableAmount,
          func: requestWithdrawalFunc,
          // func: processRequestFunc,
        });
      };
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
