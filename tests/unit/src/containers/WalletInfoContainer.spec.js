import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import WalletInfoContainer from '@/containers/WalletInfoContainer.vue';

describe('WalletInfoContainer.vue', () => {
  let localVue;
  let state, store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    state = {
      account: '0xdead',
      networkId: '1',
      balance: '100',
    };
    store = new Vuex.Store({
      state,
    });

    wrapper = shallowMount(WalletInfoContainer, {
      localVue,
      store,
    });
  });

  it('should render correct store data', () => {
    const contents = wrapper.findAll('.wallet-info-content');

    expect(contents.wrappers[0].text()).toBe(state.account);
    expect(contents.wrappers[1].text()).toBe(state.balance);
    expect(contents.wrappers[2].text()).toBe(state.networkId);
  });
});
