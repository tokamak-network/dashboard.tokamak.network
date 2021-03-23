<template>
  <div class="modal-container">
    <button @click="closeModal()">X</button>
    <div>{{ rewardTON }}</div>
    <div>{{ rewardUSD }}</div>
    <div>{{ rewardKRW }}</div>
    <div>{{ roi }}</div>
    <button @click="stake">Stake</button>
  </div>
</template>
<script>
export default {
  props:{
    roi:{
      required: true,
      type: String,
    },
    rewardTON:{
      required: true,
      type: String,
    },
    rewardUSD:{
      required: true,
      type: String,
    },
    rewardKRW:{
      required: true,
      type: String,
    },
    myStaked: {
      required: true,
      type: String,
    },
  },
  methods:{
    closeModal () {
      this.$emit('closeModal');
    },
    stake () {
      this.$emit('openStake');
    },
  },
};
</script>
<style scoped>
.modal-container {
    background-color: #ffffff;
    height: 300px;
  width: 200px;
}
</style>
