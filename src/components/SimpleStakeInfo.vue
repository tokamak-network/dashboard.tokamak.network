<template>
  <div class="simple-stake-info-container">
    <img
      src="@/assets/images/Operator.png"
      width="36"
      height="36"
    >
    <div class="simple-stake-info-operator">
      {{ operator.name }}
    </div>
    <div class="simple-stake-info-amount">
      {{ operator.userClaim.toNumber() }}
    </div>
    <div class="simple-stake-info-unit">
      TON
    </div>
    <div
      class="simple-stake-info-button"
      @click="showModal"
    >
      CLAIM
    </div>
  </div>
</template>

<script>
export default {
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    showModal () {
      this.$store.dispatch('showModal', 'claim');
    },
  },
};
</script>

<style scoped>
.simple-stake-info-container {
  height: 50px;
  padding-left: 16px;
  padding-right: 20px;
  display: flex;
  align-items: center;
}

.simple-stake-info-operator {
  flex: 1;
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

.simple-stake-info-amount {
  font-size: 14px;
  padding-bottom: 2px;
  font-weight: 500;
  text-align: left;
  color: #586064;
  margin-right: 2px;
}

.simple-stake-info-unit {
  font-size: 10px;
  font-weight: 300;
  text-align: left;
  color: #586064;
  margin-right: 6px;
}

.simple-stake-info-button {
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

.simple-stake-info-button:hover {
  cursor: pointer;
  background-color: #f7f8f9;
}
</style>
