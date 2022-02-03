import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import HomeLayout from '@/layouts/HomeLayout.vue';
import MenuLayout from '@/layouts/MenuLayout.vue';
import SupportLayout from '@/layouts/SupportLayout.vue';
import WalletLayout from '@/layouts/WalletLayout.vue';
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
    path: '/support',
    component: SupportLayout,
  },
  {
    path: '/wallet',
    component: WalletLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
