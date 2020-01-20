import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import AccessWalletLayout from '@/layouts/AccessWalletLayout.vue';

describe('AccessWalletLayout.vue', () => {
  let localVue;
  let actions, store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    actions = {
      logout: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(AccessWalletLayout, {
      localVue,
      store,
    });
  });

  it('', () => {});
});
