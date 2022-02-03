import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import DashboardLayout from '@/layouts/DashboardLayout.vue';
import OperatorListLayout from '@/layouts/OperatorListLayout.vue';
import StakeInfoLayout from '@/layouts/StakeInfoLayout.vue';
import OperatorInfoLayout from '@/layouts/OperatorInfoLayout.vue';
import HistoryLayout from '@/layouts/HistoryLayout.vue';
import OperatorInfoEditLayout from '@/layouts/OperatorInfoEditLayout.vue';
import DelegateLayout from '@/layouts/DelegateLayout.vue';

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
    path: '/operators/:layer2',
    component: OperatorInfoLayout,
  },
  {
    path: '/operators/:layer2/edit',
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
  {
    path: '/delegate',
    component: DelegateLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
