import moment from 'moment';
import Web3 from 'web3';
const locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale);

import { BN } from 'web3-utils';
import { Currency, createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
const _POWER = createCurrency('POWER');

import { getConfig } from '../../config.js';
import numeral from 'numeral';

export function hexSlicer (address, chars = 4) {
  if (address.length < 11) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;}

export function prettifyTransactionHash (address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Note: Despite Unix timestamps being UTC-based, this function creates a moment object in local mode.
// (https://momentjs.com/docs/#/parsing/unix-timestamp/)
export function formattedTimestamp (timestamp) {
  return moment.unix(timestamp).format('MMM DD, YYYY HH:mm:ss');
}

export function formatTimeString (timestamp) {
  return moment.unix(timestamp).format('YYYY.MM.DD');
}
export function formatTimeSeconds (timestamp) {
  return moment.unix(timestamp).format('hh:mm:ss');
}
export function timezone (timestamp) {
  return moment.unix(timestamp).format('ZZ');
}
export function fromNow (timestamp, suffix) {
  return moment.unix(timestamp).fromNow(suffix);
}

export function stringToTON (amount) {
  try {
    return _TON.ray(amount);
  } catch (e) {
    return amount;
  }
}

export function nameOfNetwork (networkId) {
  if (typeof networkId === 'string') {
    networkId = parseInt(networkId);
  }

  if (networkId === 1) return 'Mainnet';
  if (networkId === 2) return 'Morden';
  if (networkId === 3) return 'Ropsten';
  if (networkId === 4) return 'Rinkeby';
  if (networkId === 5) return 'Goerli';
  if (networkId === 16) return 'Faraday';
  if (networkId === 42) return 'Covan';
  if (networkId === 99) return 'POA';
  if (networkId === 1337) return 'Development';

  return networkId;
}

// https://github.com/Onther-Tech/dashboard.tokamak.network/issues/49
export function currencyAmount (amount) {
  if (amount instanceof Currency) {
    if (amount.symbol === 'POWER') {
      const ton = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = ton.indexOf('.');
      return index > -1 ? `${ton.slice(0, index + 3)} POWER` : ton + ' POWER';
    } else if (amount.symbol === 'TON') {
      const ton = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = ton.indexOf('.');
      return index > -1 ? `${ton.slice(0, index + 3)} TON` : ton + ' TON';
    } else if (amount.symbol === 'WTON'){
      const wtonAmount = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = wtonAmount.indexOf('.');
      return index > -1 ? `${wtonAmount.slice(0, index + 3)} TON` : wtonAmount + ' TON';
    }
  } else {
    return amount;
  }
}

export function currencyAmountWithoutUnit (amount) {
  if (amount instanceof Currency) {
    if (amount.symbol === 'POWER') {
      const ton = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = ton.indexOf('.');
      return index > -1 ? `${ton.slice(0, index + 3)} POWER` : ton + ' POWER';
    } else if (amount.symbol === 'TON') {
      const ton = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = ton.indexOf('.');
      return index > -1 ? `${ton.slice(0, index + 3)}` : ton + '';
    } else if (amount.symbol === 'WTON'){
      const wtonAmount = Number(amount.toBigNumber()).toLocaleString('en-US');
      const index = wtonAmount.indexOf('.');
      return index > -1 ? `${wtonAmount.slice(0, index + 3)}` : wtonAmount + '';
    }
  } else {
    return amount;
  }
}

// deprecated (will be deleted)
export function currencyAmountFromNumberString (symbol, amount) {
  if (symbol === 'TON') {
    amount = _TON.wei(amount);
    const tonAmount = amount.toBigNumber().toString();
    const index = tonAmount.indexOf('.');
    return index > -1 ? `${tonAmount.slice(0, index + 3)} TON` : tonAmount + '.00 TON';
  } else {
    amount = _WTON.ray(amount);
    const wtonAmount = amount.toBigNumber().toString();
    const index = wtonAmount.indexOf('.');
    return index > -1 ? `${wtonAmount.slice(0, index + 3)} TON` : wtonAmount + '.00 TON';
  }
}

export function toExplorer (type, param) {
  if (type === 'transactionHash') {
    return getConfig().prefixTransactionHash + param;
  } else if (type === 'address') {
    return getConfig().prefixAddress + param;
  } else {
    return this.content;
  }
}

export function userSeigsRate (userStaked, userSeigs) {
  if (userStaked.eq(_WTON('0'))) {
    return '0.00%';
  }
  const sum = userStaked.add(userSeigs);
  const rate = sum.sub(userStaked).div(userStaked);

  return `${numeral(Number(rate.toBigNumber().toString())).format('0.0000%')}`;
}

export function rateOf (commission) {
  if (!commission) {
    return '0 %';
  }
  return `${commission.toNumber() * 100} %`;
}

export function addressExtractor (url) {
  const lastIndex = url.lastIndexOf('/');
  return url.substring(lastIndex + 1);
}

export function withComma (n) {
  try {
    n = parseFloat(n);
  } catch (err) {
    if (err) console.log('bug', 'parse float'); // eslint-disable-line
  }

  return n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
