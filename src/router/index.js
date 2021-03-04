import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// import DashboardLayout from '@/layouts/DashboardLayout.vue';
// import OperatorListLayout from '@/layouts/OperatorListLayout.vue';
// import StakeInfoLayout from '@/layouts/StakeInfoLayout.vue';
// import OperatorInfoLayout from '@/layouts/OperatorInfoLayout.vue';
// import HistoryLayout from '@/layouts/HistoryLayout.vue';
// import OperatorInfoEditLayout from '@/layouts/OperatorInfoEditLayout.vue';
// import PowerTONLayout from '@/layouts/PowerTONLayout.vue';
// import DelegateLayout from '@/layouts/DelegateLayout.vue';
import HomeLayout from '@/layouts/HomeLayout.vue';
import MenuLayout from '@/layouts/MenuLayout.vue';
import StakingLayout from '@/layouts/StakingLayout.vue';
import StakeByOperatorLayout from '@/layouts/StakeByOperatorLayout.vue';
import AboutUsLayout from '@/layouts/AboutUsLayout.vue';
import PowerLayout from '@/layouts/PowerLayout.vue';
const routes = [
  // {
  //   path: '/dashboard',
  //   component: DashboardLayout,
  // },
  // {
  //   path: '/operators',
  //   component: OperatorListLayout,
  // },
  // {
  //   path: '/operators/:layer2',
  //   component: OperatorInfoLayout,
  // },
  // {
  //   path: '/operators/:layer2/edit',
  //   component: OperatorInfoEditLayout,
  // },
  // {
  //   path: '/powerton',
  //   component: PowerTONLayout,
  // },
  // {
  //   path: '/staking',
  //   component: StakeInfoLayout,
  // },
  //
  {
    path: '/',
    component: HomeLayout,
  },
  {
    path: '/menu',
    component: MenuLayout,
  },
  {
    path: '/staking',
    component: StakingLayout,
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
