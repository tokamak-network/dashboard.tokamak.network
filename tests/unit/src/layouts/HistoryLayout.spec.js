import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import HistoryLayout from '@/layouts/HistoryLayout.vue';

describe('HistoryLayout.vue', () => {
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

    wrapper = shallowMount(HistoryLayout, {
      localVue,
      store,
    });
  });

  it('', () => {});
});
