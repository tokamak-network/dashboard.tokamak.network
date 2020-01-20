import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

import DashboardLayout from '@/layouts/DashboardLayout.vue';

describe('DashboardLayout.vue', () => {
  let localVue;
  let router;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueRouter);

    router = new VueRouter();
    wrapper = shallowMount(DashboardLayout, {
      localVue,
      router,
    });
  });

  it('should route correct url when more button is clicked', () => {
    const moreButtons = wrapper.findAll('.dashboard-more-button');

    moreButtons.wrappers[0].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/operators');

    moreButtons.wrappers[1].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/staking');

    moreButtons.wrappers[2].trigger('click');
    expect(wrapper.vm.$route.path).toBe('/history');
  });
});
