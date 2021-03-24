const config = {
  'mainnet': {
    'baseURL': 'https://dashboard-api.tokamak.network',
    'candidate': 'https://api-dev.tokamak.network/v1',
    'prefixTransactionHash': 'https://etherscan.io/tx/',
    'prefixAddress': 'https://etherscan.io/address/',
    'network': '1',
  },
  'rinkeby': {
    'baseURL': 'https://dashboard-api.tokamak.network/rinkeby',
    'candidate': 'https://api-dev.tokamak.network/v1',
    'prefixTransactionHash': 'https://rinkeby.etherscan.io/tx/',
    'prefixAddress': 'https://rinkeby.etherscan.io/address/',
    'network': '4',
  },
  'development': {
    'baseURL': 'http://127.0.0.1:9000',
    'candidate': 'https://daoapi.tokamak.network/v1',
    'prefixTransactionHash': 'https://etherscan.io/tx/',
    'prefixAddress': 'https://etherscan.io/address/',
    'network': '1',
  },
};

const query = window.location.search;
const params = new URLSearchParams(query);
const network = params.get('network');

export function getConfig () {
  switch (network) {
  case 'rinkeby':
    return config.rinkeby;
  case 'development':
    return config.development;
  default:
    return config.rinkeby;
  }
}

export function getLink (type) {
  // TODO: migrate to config/default.json
  if (type === 'use') {
    return 'https://docs.tokamak.network/';
  } else if (type === 'register') {
    return 'https://docs.tokamak.network/';
  } else {
    throw new Error(`Unknown type ${type}`);
  }
}
