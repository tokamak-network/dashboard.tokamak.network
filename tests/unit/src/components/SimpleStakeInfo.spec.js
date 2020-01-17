import { shallowMount } from '@vue/test-utils';

import SimpleStakeInfo from '@/components/SimpleStakeInfo.vue';

describe('SimpleStakeInfo.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SimpleStakeInfo);
  });

  it('should render correct props', () => {
    const operator = 'op';
    const amount = '100';
    wrapper.setProps({ operator, amount });

    const simpleStakeInfoOperator = wrapper.find('.simple-stake-info-operator');
    expect(simpleStakeInfoOperator.text()).toBe(operator);

    const simpleStakeInfoAmount = wrapper.find('.simple-stake-info-amount');
    expect(simpleStakeInfoAmount.text()).toBe(amount);
  });
});
