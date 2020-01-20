import store from '@/store';

test('setWalletInfo', () => {
  const walletInfo = {
    web3: 'web3',
    account: '0xdead',
    networkId: '1',
    balance: '100',
  };

  expect(store.state.web3).toBe(null);
  expect(store.state.account).toBe('');
  expect(store.state.networkId).toBe('');
  expect(store.state.balance).toBe('');
  expect(store.state.isWalletConnected).toBe(false);

  store.dispatch('setWalletInfo', walletInfo);
  expect(store.state.web3).toBe(walletInfo.web3);
  expect(store.state.account).toBe(walletInfo.account);
  expect(store.state.networkId).toBe(walletInfo.networkId);
  expect(store.state.balance).toBe(walletInfo.balance);
  expect(store.state.isWalletConnected).toBe(true);
});

test('showModal', () => {
  const modalType = '1';

  expect(store.state.modalType).toBe('');
  expect(store.state.isModalShowed).toBe(false);

  store.dispatch('showModal', modalType);
  expect(store.state.modalType).toBe(modalType);
  expect(store.state.isModalShowed).toBe(true);
});

test('closeModal', () => {
  expect(store.state.modalType).toBe('1');
  expect(store.state.isModalShowed).toBe(true);

  store.dispatch('closeModal');
  expect(store.state.modalType).toBe('');
  expect(store.state.isModalShowed).toBe(false);
});

test('logout', () => {
  store.dispatch('logout');

  expect(store.state.web3).toBe(null);
  expect(store.state.account).toBe('');
  expect(store.state.networkId).toBe('');
  expect(store.state.balance).toBe('');
});
