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
    const account = wrapper.find('.account');
    expect(account.text()).toBe(state.account);

    const networkId = wrapper.find('.network-id');
    expect(networkId.text()).toBe(state.networkId);

    // TODO: balance -> ton, wton
    const tonBalance = wrapper.find('.ton-balance');
    expect(tonBalance.text()).toBe(state.balance);

    const wtonBalance = wrapper.find('.wton-balance');
    expect(wtonBalance.text()).toBe(state.balance);
  });
});
