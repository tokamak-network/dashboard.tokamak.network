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
          Onther
        </div>
        <div style="display: flex; margin-top: 16px;">
          <div class="operator-info-label">
            Describe
          </div>
          <div class="operator-info-content">
            Onther Operator On...
          </div>
        </div>
        <div style="display: flex;">
          <div class="operator-info-label">
            Website
          </div>
          <div class="operator-info-content">
            www.tokamak.network
          </div>
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
    <div class="operator-info-detailed-container">
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Total stake
        </div>
        <div class="operator-info-detailed-content">
          2.22%
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Self stake
        </div>
        <div class="operator-info-detailed-content">
          2.22%
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Reward
        </div>
        <div class="operator-info-detailed-content">
          2.22%
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Commit count
        </div>
        <div class="operator-info-detailed-content">
          2.22%
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Avg commit time
        </div>
        <div class="operator-info-detailed-content">
          2.22%
        </div>
      </div>
      <div class="operator-info-detailed">
        <div class="operator-info-detailed-label">
          Duration
        </div>
        <div class="operator-info-detailed-content">
          2.22%
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

<style>
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
