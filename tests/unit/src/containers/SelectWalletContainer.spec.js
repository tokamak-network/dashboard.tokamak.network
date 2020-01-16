import { shallowMount } from '@vue/test-utils';
import SelectWalletContainer from '@/containers/SelectWalletContainer.vue';

describe('SelectWalletContainer.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SelectWalletContainer);
  });

  it('should set `connecting` to true on wallet click', async () => {
    const walletContainer = wrapper.find('.wallet-container');

    walletContainer.trigger('click');
    expect(wrapper.vm.$data.connecting).toEqual(true);
  });

  it('should set `connecting` to false after success accessing wallet', async () => {
    const walletContainer = wrapper.find('.wallet-container');

    walletContainer.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$data.connecting).toEqual(false);
  });
});
