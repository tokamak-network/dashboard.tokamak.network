<template>
  <div class="ton-input">
    <div class="label-container"><span class="amount">Amount</span></div>
    <div class="input-container"><input :value="amount" @keypress="isNumber" @input="updateAmount($event.target.value)"></div>
    <select v-model="selectedToken" class="ton-select" style="border:none; font-size:13px" @change="onChange($event)">
      <option class="select-option" :value="'TON'">TON</option>
      <option class="select-option" :value="'WTON'">WTON</option>
    </select>
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
  data () {
    return {
      selectedToken: '',
    };
  },
  created () {
    this.selectedToken = 'TON';
  },
  methods: {
    onChange (event) {
      this.selectedToken = event.target.value;
      this.$emit('token', event.target.value);
    },
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
  height: 26px;
  display: flex;
  flex-direction: row;
  border-top: solid 1px #ced6d9;
  border-bottom: solid 1px #ced6d9;
  padding-top: 0.6px;
  padding-bottom: 0.6px;
}

.label-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
}

input {
  display: table-cell;
  width: 95%;
  height: 100%;
  font-size: 14px;
  text-align: right;
  border: none;
  border-left: solid 1px #ced6d9;
  border-right: solid 1px #ced6d9;
  padding-right: 6px;
}
input:focus {
  outline: none;
}
span {
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.amount {
  margin-left: 4px;
  margin-right: 4px;
}

.unit {
  margin-left: 12px;
  margin-right: 4px;
}
.select-option {
  font-size: 13px;
}

select:focus {
  outline: none;
}
</style>
