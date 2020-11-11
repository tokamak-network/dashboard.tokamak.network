<template>
  <div class="menu-layout">
    <div class="menu-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <h1 class="page-header">Select your favorite operator!!</h1>
      <div class="page-text">Earn rewards by staking your TON with our operators. Select an operator to stake, unstake, or withdraw your tokens.</div>
      <div class="balance-container">
        <div v-for="(operator, index) in operators" :key="index">
          <OperatorComponent :layer2="operator.layer2" rewards="Expected rewards" value="0.000" />
        </div>
        <!-- <OperatorComponent title="Total Staked TON" balance="0.000" rewards="New rewards per block" value="0.000" /> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import OperatorComponent from '@/components/OperatorComponent.vue';
export default {
  components: {
    OperatorComponent,
  },
  computed: {
    ...mapState([
      'operators',
    ]),
  },
};
</script>
<style scoped>
.menu-layout {
    min-width: 1174px;
    max-width: 1174px;
    display: flex;
    /* align-items: center; */
    justify-content: center;
}
.menu-content {
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
    margin-bottom: 10px;
    font-family: cursive;
    color: #555555;
    font-size: 36px;
    text-align: center;
    font-weight: 700;
    padding: 0px;
}
.page-text{
    max-width: 600px;
    margin-bottom: 20px;
    color: #8c8c8c;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
 }
.balance-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 660px;
    flex-flow: row wrap;
}
.ton-balance {
    padding-bottom: 35px;
}
</style>
