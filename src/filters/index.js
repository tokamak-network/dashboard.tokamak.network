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

export function stringToTON (amount) {
  try {
    return _TON.ray(amount);
  } catch (e) {
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

// https://github.com/Onther-Tech/dashboard.tokamak.network/issues/49
export function currencyAmount (amount) {
  if (!(amount instanceof Currency)) {
    return amount;
  }

  if (amount.symbol === 'POWER') {
    const tonAmount = amount.toBigNumber().toString();
    const index = tonAmount.indexOf('.');
    return index > -1 ? `${tonAmount.slice(0, index + 3)} POWER` : amount;
  } else if (amount.symbol === 'TON') {
    const tonAmount = amount.toBigNumber().toString();
    const index = tonAmount.indexOf('.');
    return index > -1 ? `${tonAmount.slice(0, index + 3)} TON` : amount;
  } else if (amount.symbol === 'WTON'){
    const wtonAmount = amount.toBigNumber().toString();
    const index = wtonAmount.indexOf('.');
    return index > -1 ? `${wtonAmount.slice(0, index + 3)} TON` : _TON(amount.toNumber());
  } else {
    return amount;
  }
}

import config from '../../config.json';
export function toExplorer (type, param) {
  if (type === 'transactionHash') {
    return config.prefixTransactionHash + param;
  } else if (type === 'address') {
    return config.prefixAddress + param;
  } else {
    return this.content;
  }
}
