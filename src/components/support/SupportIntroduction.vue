<template>
  <div>
    <div class="title">Introduction to staking</div>
    <h3 class="subtitle">What is staking?</h3>
    <p class="description">
      The word staking comes from the word stake. Stake means to support, or to
      secure something, such as a tent. In the blockchain space, staking means
      to deposit tokens to support the network by verifying transactions and
      sustaining its stability.
    </p>
    <p class="description">
      The background for the creation of staking in blockchain is related to how
      blocks are verified. Originally Proof of Work was to secure and verify the
      network, but it was inefficient as it wastes a large amount of
      electricity. Proof of Stake came about as an alternative to Proof of Work.
    </p>
    <p class="description">
      As a part of DeFi, staking has become a popular financial instrument, but
      in reality it was created for the security of blockchain networks and to
      incentivize those participating in the operation of the network.
      Participants stake tokens as deposits, and the network provides them with
      interest as a reward for offering this service. Staking with Tokamak
      Network is imilar but different.
    </p>
    <p class="description">
      Typical Staking based blockchains have one chain with various operators
      and thus the trust of operators wasn’t a significant factor. But for
      Tokamak Networks Layer 2 chains, anyone can open and run a plasma and
      roll-up chain. Because of this, the chain economy must be structured that
      anyone can trust the operator and the data of the L2 chain. The Tokamak
      Network staking system allows for the creation of this credibility.
    </p>
    <img class="screenshot" src="@/assets/images/support/home_01.png">
    <h3 class="subtitle">Main Composition of Tokamak Network Simple Staking</h3>
    <ol>
      <li class="mini-subtitle" style="margin-left:-20px; margin-bottom:10px">
        Home
        <ul>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            Click the <span style="font-weight:bold">Connect Wallet (05) </span> button
            to connect your metamask wallet or your Wallet Connect wallet to our
            staking service.
          </li>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            The <span style="color:#2a72e5">Blue (06)</span> graph shows the daily staked
            amount in the Tokamak Network by our stakers and the
            <span style="color:#c7d1d8">Gray (07)</span> graph shows the daily Actual
            APY. Hover over the graphs to see the daily amounts of total staking and
            Actual APY.
          </li>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            You can check PowerTON round infromation such as Round started date,
            round prize, and round end date under the graphs.
          </li>
        </ul>
      </li>
      <li class="mini-subtitle" style="margin-left:-20px; margin-bottom:10px">
        Staking
        <ul>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            You can see information about our operators on the staking page. Click
            on the blue arrow to the right of each operator to see detailed
            information about the operator and staking buttons when you have
            connected your wallet. When you haven't connected your wallet, you can
            only see the details of the operator.
          </li>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            When your wallet is connected, you can click the staking buttons to
            stake your TON. For more information please check the Stake, Un-stake,
            Re-stake, or Withdraw sections.
          </li>
        </ul>
      </li>
      <li class="mini-subtitle" style="margin-left:-20px; margin-bottom:10px">
        PowerTON
        <ul>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            Power is issued on the basis of contribution to the network, the same as
            the distribution of commit reward, thereby distributing additional
            reward. Power is not available for purchase or transaction and can only
            be obtained through contributing to the Tokamak Network, and the more
            delegates it has, the more Power it grows.
          </li>
          <li class="description" style="margin-left:-10px; margin-bottom:10px"> You can see the PowerTON round information and past round winners and ranks in this page. For more infromation please go to the PowerTON section </li>
        </ul>
      </li>
      <li class="mini-subtitle" style="margin-left:-20px; margin-bottom:10px">
        Wallet
        <ul>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">
            Wallet gives you personal information about your assets.
          </li>
          <li class="description" style="margin-left:-10px; margin-bottom:10px">Using the graph, you can check your daily rewards within a desired time period. For more information please check the Wallet section. </li>
        </ul>
      </li>
    </ol>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.title {
  font-family: Roboto;
  font-size: 22px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 0.2px;
  text-align: left;
  color: #2a72e5;
  margin-bottom: 20px;
}
.subtitle {
  font-family: Roboto;
  font-size: 18px;
  font-weight: 700;
  color: #3d495d;
}
.description {
  font-size: 17px;
  text-align: left;
  font: Roboto;
  color: #3d495d;
}
.screenshot {
  width: 100%;
  height: 100%;
  margin-top: 70px;
  margin-bottom: 40px;
 box-shadow: 0 1px 4px 0 rgba(96, 97, 112, 0.16);
}
.mini-subtitle {
  font: Roboto;
  font-size: 18px;
  color: #2a72e5;
  font-weight: normal;
}
</style>
