import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import MainLayout from '@/layouts/MainLayout.vue';
import SendTransactionModal from '@/containers/modal/SendTransactionModal.vue';

describe('MainLayout.vue', () => {
  let localVue;
  let state, store;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);

    state = { isModalShowed: false };
    store = new Vuex.Store({ state });
  });

  it('should not render modal when "isModalShowed" is false', () => {
    const wrapper = shallowMount(MainLayout, {
      localVue,
      store,
    });

    const modal = wrapper.find(SendTransactionModal);
    expect(modal.exists()).toBeFalsy();
  });

  it('should call "closeModal" method when "modalClosed" event is emitted', () => {
    state.isModalShowed = true;
    const wrapper = shallowMount(MainLayout, {
      localVue,
      store,
    });
    const closeModal = jest.fn();
    wrapper.setMethods({ closeModal });

    const modal = wrapper.find(SendTransactionModal);
    modal.vm.$emit('modalClosed');
    expect(modal.emitted().modalClosed).toBeTruthy();
    expect(closeModal).toBeCalled();
  });
});
