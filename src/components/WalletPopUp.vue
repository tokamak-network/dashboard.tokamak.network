<template>
  <div class="model-wrapper">
    <div class="model-container">
      <div class="model-close">
        <img
          class="model-close-btn"
          :src="require(`@/assets/images/popup-close-icon.svg`)"
          @click="closeModal()"
        >
      </div>
      <div class="model-content">
          <div class="model-content-subTitle">Connect your wallet to access your information</div>
     <button
          class="model-btn"
          @click="closeModal"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeModal () {
      this.$emit('closePopup');
    },
  },
};
</script>
<style scoped>
textarea:focus,
input:focus,
button:focus {
  outline: none;
}
.model-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.model-container {
  display: flex;
  flex-direction: column;
  width: 424px;
}
.model-close {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.model-close-btn {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
.model-content {
  width: 390px;
  height: 206px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: #ffffff;
  padding-top: 25px;
  padding-bottom: 20px;
}
.model-content-title {
  font-size: 20px;
  font-weight: bold;
  font-family: "Titillium Web", sans-serif;
  margin-bottom: 0px;
}
.model-content-subTitle {
  font-size: 22px;
  color: #86929d;
  font-family: Roboto;
  margin-bottom: 0px;
  text-align: center;
  margin: 0px 70px;
}
.model-line {
  width: 100%;
  height: 1px;
  background-color: #f4f6f8;
  margin-top: 20px;
}
.model-ton-stake {
  width: 100%;
  height: 84px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.model-ton-stake-amount {
  font-size: 38px;
  color: #304156;
  font-weight: 500;
}
.model-ton-stake-btn {
  width: 56px;
  height: 25px;
  border-radius: 4px;
  border: solid 1px #dfe4ee;
  background-color: #ffffff;
  font-size: 12px;
  color: #86929d;
  cursor: pointer;
  position: fixed;
  margin-left: 250px;
}
.model-ton-balance {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 82.8%;
  height: 55px;
}
.model-ton-balance-title {
  font-size: 12px;
  color: #808992;
  font-weight: 500;
  margin-bottom: 0;
}
.model-ton-balance-amount {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #3d495d;
  font-weight: 500;
}
.model-description {
  font-size: 12px;
  font-weight: 500;
  color: #2a72e5;
  margin-top: 25px;
  margin-bottom: 25px;
}
.model-btn {
  width: 150px;
  height: 38px;
  border-radius: 4px;
  background-color: #257eee;
  color: #ffffff;
  border: none;
  cursor: pointer;
  margin-top: 40px;
}
.model-btn-notavailable {
  background-color: #e9edf1;
}
.model-line-bottom {
  margin-bottom: 25px;
}
</style>
