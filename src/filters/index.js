import moment from 'moment';

export function addressSlicer (address = '') {
  if (address.length < 11) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function fromNow (timestamp) {
  return moment.unix(timestamp).fromNow();
}
