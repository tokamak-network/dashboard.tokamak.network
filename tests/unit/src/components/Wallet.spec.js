import { shallowMount } from '@vue/test-utils';

import Wallet from '@/components/Wallet.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

describe('Wallet.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Wallet);
  });

  it('should render correct image', async () => {
    // TODO: dynamic image
  });

  it('should render correct title', async () => {
    const title = 'title';
    wrapper.setProps({ title });

    const walletTitle = wrapper.find('.wallet-title');
    expect(walletTitle.text()).toBe(title);
  });

  it('should render correct loading state', async () => {
    wrapper.setProps({ loading: true });

    const loadingSpinner = wrapper.find(LoadingSpinner);
    expect(loadingSpinner.exists()).toBeTruthy();
  });
});
