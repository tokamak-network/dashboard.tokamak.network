import Vue from 'vue';
import Notifications from 'vue-notification';
import VModal from 'vue-js-modal';
import VueGtag from 'vue-gtag';
import VueClipboard from 'vue-clipboard2';
import vClickOutside from 'v-click-outside';
import ToggleButton from 'vue-js-toggle-button';


Vue.use(VueGtag, {
  config: {
    id: 'G-E0YQDXW30R',
  },
});
Vue.use(Notifications);
Vue.use(VModal);
Vue.use(vClickOutside);

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);
Vue.use(ToggleButton);

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/960.css';
// import '@/assets/css/reset.css';
import '@/assets/css/text.css';
import * as filters from '@/filters';

// https://vuedose.tips/tips/measure-runtime-performance-in-vue-js-apps
const isDev = process.env.NODE_ENV !== 'production';
Vue.config.performance = isDev;

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
