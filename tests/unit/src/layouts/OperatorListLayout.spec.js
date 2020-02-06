import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import OperatorListLayout from '@/layouts/OperatorListLayout.vue';
import SearchBar from '@/components/SearchBar.vue';
import StandardTable from '@/components/StandardTable.vue';

describe('OperatorListLayout.vue', () => {
  let localVue;
  let actions, store;
  let wrapper;

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuex);

    actions = {
      logout: jest.fn(),
      // checkAndGetData: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
    });

    wrapper = shallowMount(OperatorListLayout, {
      localVue,
      store,
    });
  });

  it('should call "searchOperatorByName" method when "valueChanged" event is emitted', () => {
    const searchOperatorByName = jest.fn();
    wrapper.setMethods({ searchOperatorByName });

    const search = wrapper.find(SearchBar);
    search.vm.$emit('valueChanged');

    expect(search.emitted().valueChanged).toBeTruthy();
    expect(searchOperatorByName).toBeCalled();
  });

  it('should call "clickOperatorInfo" method when "tableDataClicked" event is emitted', () => {
    const clickOperatorInfo = jest.fn();
    wrapper.setMethods({ clickOperatorInfo });

    const table = wrapper.find(StandardTable);
    table.vm.$emit('tableDataClicked');

    expect(table.emitted().tableDataClicked).toBeTruthy();
    expect(clickOperatorInfo).toBeCalled();
  });
});
