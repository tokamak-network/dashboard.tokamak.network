<template>
  <div class="gnb">
    <a href="" :style="{ width: '100px' }" class="link">
      <div>Vision</div>
    </a>
    <a
      href="https://tokamak.network/#/"
      :style="{ width: '158px' }"
      class="link"
    >
      <div>Tokamak Network</div>
    </a>
    <a
      href="https://rinkeby.tonstarter.tokamak.network/"
      :style="{ width: '114px' }"
      class="link"
    >
      <div>TONStarter</div>
    </a>
    <a
      href="https://rinkeby.simple.staking.tokamak.network/"
      :style="{ width: '90px' }"
      class="active-link"
    >
      <div>Staking</div>
    </a>
    <a
      href="https://rinkeby.dao.tokamak.network/#/"
      :style="{ width: '68px' }"
      class="link"
    >
      <div>DAO</div>
    </a>
    <a
      href="https://tonswapper.vercel.app/"
      :style="{ width: '76px' }"
      class="link"
    >
      <div>Swap</div>
    </a>
  </div>
</template>

<script>
export default {};
</script>
<style>
.gnb {
  display: flex;
  min-width: 100%;
  background: #2775ff;
  color: #ffffff;
  font-weight: bold;
  justify-content: center;
}
.link {
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 15px;
  height: 45px;
  line-height: 1.53;
  text-decoration: none;
  justify-content: center;
  font-family: "Titillium Web", sans-serif;
}

.link:hover {
  cursor: pointer;
}

.active-link {
  background: #ffffff;
  color: #353c48;
  display: flex;
  line-height: 1.53;
  align-items: center;
  font-size: 15px;
  height: 45px;
  text-decoration: none;
  justify-content: center;
  font-family: "Titillium Web", sans-serif;
}

.active-link:hover {
  cursor: pointer;
}
</style>
