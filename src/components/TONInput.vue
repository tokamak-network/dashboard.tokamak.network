<template>
  <div class="ton-input">
    <div class="label-container"><span>AMOUNT</span></div>
    <div class="input-container"><input :value="amount" @keypress="isNumber" @input="updateAmount($event.target.value)"></div>
    <div class="label-container"><span>TON</span></div>
  </div>
</template>

<script>
export default {
  props: {
    amount: {
      type: String,
      default: '',
    },
  },
  methods: {
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    updateAmount (amount) {
      this.$emit('input', amount);
    },
  },
};
</script>

<style scoped>
.ton-input {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
}

.label-container {
  border: 1px solid #b4b4b4;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 4px;
  padding-right: 4px;
}

span {
  display: block;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
}

.input-container {
  flex: 1;
  display: table;
  height: 100%;
  border-top: 1px solid #b4b4b4;
  border-bottom: 1px solid #b4b4b4;
}

input {
  display: table-cell;
  width: 100%;
  height: 100%;
  font-size: 16px;
  text-align: right;
}
</style>
