// https://chainid.network/chains.json
const chains = require('../../src/helpers/chainids.json');
const chainIds = chains.map(chain => chain.chainId);

const GET = (db) => {
  try {
    const chainIdsOfOperator = db
      .get('operators')
      .map('chainId')
      .value();

    return Promise.resolve(chainIds.concat(chainIdsOfOperator));
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
};
