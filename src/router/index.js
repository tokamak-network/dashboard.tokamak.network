import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import DashboardLayout from '@/layouts/DashboardLayout.vue';
import OperatorListLayout from '@/layouts/OperatorListLayout.vue';

const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
  },
  {
    path: '/operators',
    component: OperatorListLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
