<template>
  <div class="gnb_mobile_header mobilee">
    <img
      src="@/assets/images/pagenate-prev-arrow-icon-inactive_1.svg"
      alt=""
      height="40px"
      @click="handleNavigation(e, false)"
    >
    <div class="gnb_mobile_menu_wrap">
      <a
        v-for="(menu, index) in menus"
        :key="index"
        class="gnb_mobile_menu"
        :style="[
           menu.title === 'DAO'
            ? { minWidth: '35px' }
            : menu.title === 'Tokamak Network'
            ? { minWidth: '130px' }
            : menu.title === 'Staking'
            ? { minWidth: '55px' }
            : menu.title === 'L2 Mainnet'
            ? { minWidth: '90px' }
            : menu.title === 'Bridge & Swap'
            ? { minWidth: '112px' }
            : {},
          menu.isFoucsed ? { fontWeight: 600 } : {},
          menu.isFoucsed ? { opacity: 1 } : { opacity: 0.25 },
          index === menus.length - 1 ? { marginRight: '31%' } : {},
          index === 0 ? { marginLeft: `${(deviceWidth - 80 - 78) / 2}px` } : {},
        ]"
        :href="menu.url"
        @touchstart="(e) => catchTouchStart(e)"
        @touchend="(e) => handleNavigation(e)"
      >
        {{ menu.title }}
      </a>
    </div>

    <img
      src="@/assets/images/pagenate-prev-arrow-icon-inactive_2.svg"
      alt=""
      width="40px"
      height="40px"
      @click="handleNavigation(e, true)"
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      menus: [
        {
          title: 'Tokamak Network',
          url: 'https://tokamak.network/#/',
          isFoucsed: false,
        },
        {
          title: 'L2 Mainnet',
          url: 'http://titan.tokamak.network/',
          isFoucsed: false,
        },
        {
          title: 'Bridge & Swap',
          url: 'https://bridge.tokamak.network/#/',
          isFoucsed: false,
        },
        {
          title: 'Staking',
          url: 'https://simple.staking.tokamak.network/',
          isFoucsed: true,
        },
        {
          title: 'DAO',
          url: 'https://dao.tokamak.network/#/',
          isFoucsed: false,
        },
        {
          title: 'Launchpad',
          url: 'https://tonstarter.tokamak.network/',
          isFoucsed: false,
        },
      ],
      width: 0,
      currentPosition: 0,
      touchStartX: 0,
      deviceWidth: window.innerWidth,
    };
  },
  methods: {
    toRightXvalue () {
      switch (this.currentPosition) {
      case 0:
        return -120;
      case 1:
        return -270;
      case 2:
        return -430;
      case 3:
        return -560;
      default:
        return null;
      }
    },
    toLeftXvalue () {
      switch (this.currentPosition) {
      case 0:
        return 0;
      case 1:
        return 0;
      case 2:
        return -120;
      case 3:
        return -270;
      case 4:
        return -430;
      default:
        return null;
      }
    },

    catchTouchStart (e) {
      const touchObj = e.changedTouches[0];
      this.touchStartX = touchObj.pageX;
    },
    handleNavigation (e, rightArrow) {
      const ref = document.getElementsByClassName('gnb_mobile_menu');
      const transition = '0.8s ease-in-out';

      let direction;
      if (rightArrow !== undefined) {
        direction = rightArrow;
      } else {
        const touchObj = e.changedTouches[0];
        // const distX = touchObj.pageX - touchStartX;

        direction = this.touchStartX > touchObj.pageX;
      }
      try {
        if (direction) {
          const xValue = this.toRightXvalue();
          const traslateX = `translateX(${xValue}px)`;
          ref[0].style.transition = transition;
          ref[0].style.transform = traslateX;

          ref[1].style.transition = transition;
          ref[1].style.transform = traslateX;

          ref[2].style.transition = transition;
          ref[2].style.transform = traslateX;

          ref[3].style.transition = transition;
          ref[3].style.transform = traslateX;

          ref[4].style.transition = transition;
          ref[4].style.transform = traslateX;

          ref[5].style.transition = transition;
          ref[5].style.transform = traslateX;
          return;
        }
        const xValue = this.toLeftXvalue();
        // e.target.style.transition = "0.8s linear";
        // e.target.style.transform = `translateX(100px)`;

        const traslateX = `translateX(${xValue}px)`;

        ref[0].style.transition = transition;
        ref[0].style.transform = traslateX;

        ref[1].style.transition = transition;
        ref[1].style.transform = traslateX;

        ref[2].style.transition = transition;
        ref[2].style.transform = traslateX;

        ref[3].style.transition = transition;
        ref[3].style.transform = traslateX;

        ref[4].style.transition = transition;
        ref[4].style.transform = traslateX;

        ref[5].style.transition = transition;
        ref[5].style.transform = traslateX;
      } finally {
        if (-1 < this.currentPosition && this.currentPosition < 4) {
          direction ? (this.currentPosition += 1) : (this.currentPosition -= 1);
        }
        if (this.currentPosition === -1) {
          this.currentPosition = 0;
        }
        if (this.currentPosition === 4 && direction === false) {
          this.currentPosition -= 1;
        }
        // lastX = e.target.offsetLeft;
      }
    },
  },
};
</script>

<style scoped>
@media only screen and (min-width: 631px) {
  .mobilee {
    display: none !important;
  }
}

::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}
::-webkit-scrollbar-button {
  width: 1px;
  height: 1px;
}

.gnb_mobile_header {
  max-width: 100%;
  background-color: #2775ff;
  display: flex;
  touch-action: none;
  font-family: "Titillium Web", sans-serif;
}

.gnb_mobile_menu_wrap {
  display: flex;
  overflow: scroll;
  touch-action: none;
}

.gnb_mobile_menu {
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  text-decoration: none;
  color: #ffffff;
  counter-increment: gallery-cell;
  touch-action: none;
}
</style>
