import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/960.css';
// import '@/assets/css/reset.css';
import '@/assets/css/text.css';
import * as filters from '@/filters';

Vue.prototype.$bus = new Vue();
Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
