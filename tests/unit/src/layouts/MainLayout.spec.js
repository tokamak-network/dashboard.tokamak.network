import { shallowMount, createLocalVue } from '@vue/test-utils';

import Vuex from 'vuex';
import VueRouter from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';

describe('MainLayout.vue', () => {
  let wrapper, localVue;
  let state, store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);

    store = new Vuex.Store({ state });
    wrapper = shallowMount(MainLayout, {
      localVue,
      store,
    });
  });
});
