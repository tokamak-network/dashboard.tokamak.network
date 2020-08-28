<template>
  <div v-if="!close" class="popup">
    <div class="button-container">
      <button class="close-button" @click="closePopup">×</button>
    </div>
    <div class="title">[ NOTICE - End of MTON Staking (Beta) Service ]</div>
    <div class="content">
      MTON Staking (Beta) Service is now terminated. Withdrawals are still available. For more information visit
      <a target="_blank"
         class="link"
         rel="noopener noreferrer"
         href="https://medium.com/onther-tech/-30be674b30a1"
      >https://medium.com/onther-tech/-30be674b30a1</a>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      close: false,
    };
  },
  methods: {
    closePopup () {
      this.close = true;
    },
  },
};
</script>
<style scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
  height: 74px;
  border-radius: 6px;
  border: solid 1px #cd0a0a;
  background-color: #ffffff;
  margin-bottom: 8px;
  justify-content: center;
}
.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: -12px;
}
.close-button {
  background: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  color: #586064;
}
.button:hover {
  cursor: pointer;
}
button:focus {
  outline: none;
}
.title {
  padding-left: 12.9px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #586064;
  font-size: 11px;
}
.content {
  padding-left: 12.9px;
  font-family: Roboto;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: 0.27px;
  color: #586064;
}
.link {
  color: #586064;
  text-decoration: none;
}
</style>
