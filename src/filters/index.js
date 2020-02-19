import moment from 'moment';
import { Currency, createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

export function hexSlicer (address = '') {
  if (address.length < 11) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function fromNow (timestamp) {
  return moment.unix(timestamp).fromNow();
}

export function convertToTON (amount) {
  if (!(amount instanceof Currency)) {
    console.log('amount is not Currency instance');
    return amount;
  }
  if (amount.symbol === 'WTON') {
    return _TON(amount.toNumber());
  } else {
    console.log('amount is already TON type');
    return amount;
  }
}

export function nameOfNetwork (networkId) {
  if (networkId === 1) return 'Mainnet';
  if (networkId === 2) return 'Morden';
  if (networkId === 3) return 'Ropsten';
  if (networkId === 4) return 'Rinkeby';
  if (networkId === 5) return 'Goerli';
  if (networkId === 42) return 'Covan';
  if (networkId === 99) return 'POA';
  if (networkId === 1337) return 'Development';

  return networkId;
}
