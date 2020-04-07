import store from '@/store/index.js';

// used only in development
export function clearPendingTransactions () {
  window.localStorage.clear();
}

export function getPendingTransactions () {
  const user = store.state.user;
  const networkId = store.state.networkId;
  const pendingTransactions = window.localStorage.getItem(`pending-transactions-${user}-${networkId}`);
  if (pendingTransactions === null) {
    return [];
  }
  return JSON.parse(pendingTransactions);
}

export function setPendingTransactions (pendingTransactions=[]) {
  const user = store.state.user;
  const networkId = store.state.networkId;
  window.localStorage.setItem(`pending-transactions-${user}-${networkId}`, JSON.stringify(pendingTransactions));
}
