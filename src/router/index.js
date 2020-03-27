import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import MainLayout from '@/layouts/MainLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import OperatorListLayout from '@/layouts/OperatorListLayout.vue';
import StakeInfoLayout from '@/layouts/StakeInfoLayout.vue';
import OperatorInfoLayout from '@/layouts/OperatorInfoLayout.vue';
import HistoryLayout from '@/layouts/HistoryLayout.vue';
import OperatorInfoEditLayout from '@/layouts/OperatorInfoEditLayout.vue';
import PowerTONLayout from '@/layouts/PowerTONLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
  },
  // {
  //   path: '/dashboard',
  //   component: DashboardLayout,
  // },
  // {
  //   path: '/operators',
  //   component: OperatorListLayout,
  // },
  {
    path: '/operator/:rootchain',
    component: OperatorInfoLayout,
  },
  // {
  //   path: '/operators/:rootchain/edit',
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
  // {
  //   path: '/history',
  //   component: HistoryLayout,
  // },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
