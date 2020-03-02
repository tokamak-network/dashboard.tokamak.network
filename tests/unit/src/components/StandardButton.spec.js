import { shallowMount } from '@vue/test-utils';

import StandardButton from '@/components/StandardButton.vue';

describe('StandardButton.vue', () => {
  let wrapper, button;

  const props = {
    label: 'label',
    disable: true,
  };

  beforeEach(() => {
    wrapper = shallowMount(StandardButton);
    wrapper.setProps({
      label: 'label',
      disable: true,
    });

    button = wrapper.find('div');
  });

  it('should render correct table header', () => {
    expect(button.text()).toBe(props.label);
    expect(button.classes()).toContain('disable');
  });

  it('should call prop\'s func if only `disable` is false', () => {
    const props1 = {
      disable: false,
      func: jest.fn(),
    };
    const props2 = {
      disable: true,
      func: jest.fn(),
    };

    wrapper.setProps(props1);
    button.trigger('click');
    expect(props1.func).toBeCalled();

    wrapper.setProps(props2);
    button.trigger('click');
    expect(props2.func).not.toBeCalled();
  });
});
