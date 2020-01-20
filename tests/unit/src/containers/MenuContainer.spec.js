import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import MenuContainer from '@/containers/MenuContainer.vue';

describe('MenuContainer.vue', () => {
  let localVue;
  let router;
  let actions, store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);
    localVue.use(VueRouter);

    actions = {
      logout: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
    });
    router = new VueRouter();

    wrapper = shallowMount(MenuContainer, {
      localVue,
      store,
      router,
    });
  });

  it('should route correct url when menu is clicked', () => {
    const menus = wrapper.findAll('.menu-title-container');
    menus.wrappers[0].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/dashboard');
    menus.wrappers[1].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/operators');

    const subMenus = wrapper.findAll('.sub-menu-title-container');
    subMenus.wrappers[0].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/operators');
    subMenus.wrappers[1].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/staking');
    subMenus.wrappers[2].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/history');

    const logout = wrapper.find('.menu-logout-container');
    logout.trigger('click');
    expect(actions.logout).toHaveBeenCalled();
  });


});
