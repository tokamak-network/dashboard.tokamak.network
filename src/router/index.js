import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import HomeLayout from '@/layouts/HomeLayout.vue';
import MenuLayout from '@/layouts/MenuLayout.vue';
import StakingLayout from '@/layouts/StakingLayout.vue';
import StakeByOperatorLayout from '@/layouts/StakeByOperatorLayout.vue';
import AboutUsLayout from '@/layouts/AboutUsLayout.vue';
import PowerLayout from '@/layouts/PowerLayout.vue';
const routes = [
  {
    path: '/home',
    component: HomeLayout,
  },
  {
    path: '/menu',
    component: MenuLayout,
  },
  {
    path: '/staking',
    component: MenuLayout,
  },
  {
    path: '/staking/:layer2',
    component: StakeByOperatorLayout,
  },
  {
    path: '/about',
    component: AboutUsLayout,
  },
  {
    path: '/powerton',
    component: PowerLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
