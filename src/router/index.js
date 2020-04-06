import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import DashboardLayout from '@/layouts/DashboardLayout.js';
import OperatorListLayout from '@/layouts/OperatorListLayout.js';
import StakeInfoLayout from '@/layouts/StakeInfoLayout.js';
import OperatorInfoLayout from '@/layouts/OperatorInfoLayout.js';
import HistoryLayout from '@/layouts/HistoryLayout.js';
import OperatorInfoEditLayout from '@/layouts/OperatorInfoEditLayout.js';
import PowerTONLayout from '@/layouts/PowerTONLayout.js';

const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
  },
  {
    path: '/operators',
    component: OperatorListLayout,
  },
  {
    path: '/operators/:rootchain',
    component: OperatorInfoLayout,
  },
  {
    path: '/operators/:rootchain/edit',
    component: OperatorInfoEditLayout,
  },
  {
    path: '/powerton',
    component: PowerTONLayout,
  },
  {
    path: '/staking',
    component: StakeInfoLayout,
  },
  {
    path: '/history',
    component: HistoryLayout,
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes,
});

export default router;
