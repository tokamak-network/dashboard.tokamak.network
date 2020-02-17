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
