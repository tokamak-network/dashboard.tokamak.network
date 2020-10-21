<template>
  <div class="about-layout">
    <div class="about-content">
      <img class="logo" src="@/assets/images/TokamakLogo.png">
      <div class="page-header">Get to know our services more!!</div>
      <div class="page-text">Tokamak Network is a platform that assures decentralized and secure property same as Ethereum Main chain while supporting high level of scalability and extendability. Each Dapp is built easily for specific purpose through Tokamak Network.</div>
      <div class="content-container">
        <ol class="list">
          <li>
            Tokamak Network Homepage  → <a target="_blank" class="list-item"
                                           rel="noopener noreferrer"
                                           href="https://tokamak.network/"
            >https://tokamak.network/</a>
          </li>
          <li>
            Tokamak Staking Dashboard  → <a target="_blank" class="list-item"
                                            rel="noopener noreferrer"
                                            href="https://staking.tokamak.network/"
            > https://staking.tokamak.network/</a>
          </li>
          <li>
            Staking Simulator  → <a target="_blank" class="list-item"
                                    rel="noopener noreferrer"
                                    href="https://staking-simulator.tokamak.network/"
            > https://staking-simulator.tokamak.network/</a>
          </li>
          <li>
            Price Dashboard  → <a target="_blank" class="list-item"
                                  rel="noopener noreferrer"
                                  href="https://price.tokamak.network/#/"
            > https://price.tokamak.network/#/</a>
          </li>
          <li>
            Tokamak Network Vesting Dashboard  → <a target="_blank" class="list-item"
                                                    rel="noopener noreferrer"
                                                    href="https://vesting.tokamak.network/#/"
            > https://vesting.tokamak.network/#/</a>
          </li>
          <li>
            Tokamak WTON Swapper  → <a target="_blank" class="list-item"
                                       rel="noopener noreferrer"
                                       href="https://wton-swapper.tokamak.network/"
            > https://wton-swapper.tokamak.network/</a>
          </li>
          <!-- <li><a target="_blank"
       rel="noopener noreferrer"
       href="https://tokamak.network/">Tokamak Network White Paper</a></li> -->
        </ol>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
// import { createCurrency } from '@makerdao/currency';
// const _TON = createCurrency('TON');

export default {
  components: {
  },
};
</script>
<style scoped>
.about-layout {
    min-width: 1200px;
    max-width: 1200px;
    display: flex;
    /* align-items: center; */
    justify-content: center;
}
.about-content {
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
.content-container {
    display: flex;
    flex-direction: row;
    width: 760px;
}
.list {
    font-size: 18px;
    height: 25px;
    color: #686868;
}
.list-item {
    text-decoration: none;
    font-size: 18px;
    height: 25px;
    color: #2a72e5;
}
</style>
