import { shallowMount } from '@vue/test-utils';

import BaseTable from '@/components/BaseTable.vue';

describe('BaseTable.vue', () => {
  let wrapper;

  const columns = [
    {
      name: 'ADDRESS',
      key: 'address',
    },
    {
      name: 'NAME',
      key: 'name',
    },
  ];
  const datas = [
    {
      address: '0xbeef',
      name: 'beef',
    },
    {
      address: '0xfeed',
      name: 'feed',
    },
  ];
  const clickable = true;

  beforeEach(() => {
    wrapper = shallowMount(BaseTable);
  });

  it('should render correct table header', () => {
    wrapper.setProps({ columns, datas });

    const ths = wrapper.findAll('th');

    expect(ths.length).toBe(columns.length);
    expect(ths.wrappers[0].text()).toBe(columns[0].name);
    expect(ths.wrappers[1].text()).toBe(columns[1].name);
  });

  it('should render correct table data', () => {
    wrapper.setProps({ columns, datas });

    const trs = wrapper.findAll('tr');
    const tds = wrapper.findAll('td');

    expect(trs.length).toBe(datas.length);
    expect(tds.length).toBe(trs.length * datas.length);

    expect(tds.wrappers[0].text()).toBe(datas[0][columns[0].key]);
    expect(tds.wrappers[1].text()).toBe(datas[0][columns[1].key]);
    expect(tds.wrappers[2].text()).toBe(datas[1][columns[0].key]);
    expect(tds.wrappers[3].text()).toBe(datas[1][columns[1].key]);
  });

  it('should render hover effect', () => {
    wrapper.setProps({ columns, datas, clickable });

    const tr = wrapper.find('tr');
    expect(tr.classes()).toContain('table-clickable');
  });

  it('should emit event when "tr" is clicked', () => {
    wrapper.setProps({ columns, datas, clickable });

    const tr = wrapper.find('tr');
    tr.trigger('click');
    wrapper.vm.$nextTick();

    expect(wrapper.emitted('tableDataClicked')).toBeTruthy();
  });
});
