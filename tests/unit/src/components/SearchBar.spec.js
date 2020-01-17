import { shallowMount } from '@vue/test-utils';

import SearchBar from '@/components/SearchBar.vue';

describe('SearchBar.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchBar);
  });

  it('should emit event when searched', () => {
    const searchBar = wrapper.find('.search-bar');
    searchBar.element.value = 's';
    searchBar.trigger('input');

    expect(wrapper.emitted('valueChanged')).toBeTruthy();
  });
});
