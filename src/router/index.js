import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import DashboardLayout from '@/layouts/DashboardLayout.vue';
import OperatorListLayout from '@/layouts/OperatorListLayout.vue';
import StakeInfoLayout from '@/layouts/StakeInfoLayout.vue';
import OperatorInfoLayout from '@/layouts/OperatorInfoLayout.vue';
import HistoryLayout from '@/layouts/HistoryLayout.vue';
import OperatorInfoEditLayout from '@/layouts/OperatorInfoEditLayout.vue';

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
    path: '/staking',
    component: StakeInfoLayout,
  },
  {
    path: '/history',
    component: HistoryLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
