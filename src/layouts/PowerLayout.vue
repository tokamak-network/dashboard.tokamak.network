<template>
  <div class="power-layout">
    <div class="power-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <div class="page-header">Win Power by staking TON!!</div>
      <div class="page-text">Be a winner of our Power TON game by staking TON. More TON you delegate, more Power you win.</div>
      <PowerWinnerTable />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import PowerWinnerTable from '@/components/table/PowerWinnerTable.vue';
export default {
  components: {
    PowerWinnerTable,
  },
  computed: {
    ...mapState([
      'user',
      'power',
      'currentRound',
      'rounds',
    ]),
    ...mapGetters([
      'rankedAccountsWithPower',
    ]),
  },
};
</script>
<style scoped>
.power-layout {
    min-width: 1174px;
    max-width: 1174px;
    display: flex;
    /* align-items: center; */
    justify-content: center;
}
.power-content {
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
    margin-bottom: 30px;
    color: #8c8c8c;
    font-size: 16px;
    text-align: center;
    font-weight: 400;
 }
.balance-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 760px;
}

</style>
