<template>
  <div class="staking-layout">
    <div class="staking-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <div class="page-header">Stake tokens now!!</div>
      <div class="page-text">Stake TON to earn TON</div>
      <div class="balance-container">
        <StakeByOperatorComponent :layer2="layer2" />
      </div>
    </div>
  </div>
</template>
<script>
import StakeByOperatorComponent from '@/components/StakeByOperatorComponent.vue';
export default {
  components: {
    StakeByOperatorComponent,
  },
  data () {
    return {
      layer2: '',
    };
  },
  created () {
    this.layer2 = this.$route.params.layer2;
  },
};
</script>
<style scoped>
.staking-layout {
    min-width: 1174px;
    max-width: 1174px;
    display: flex;
    /* align-items: center; */
    justify-content: center;
}
.staking-content {
    display: flex;
    flex-direction: column;
     align-items: center;
     width: 850px;

}
.logo {
    height: 100px;
    width: 144px;
}
.page-header {
    margin-top: 10px;
    margin-bottom: 15px;
    font-family: cursive;
    color: #555555;
    font-size: 36px;
    text-align: center;
    font-weight: 700;
    padding: 0px;
}
.page-text{
    margin-bottom: 15px;
    color: #8c8c8c;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
 }
.balance-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 660px;
}

</style>
