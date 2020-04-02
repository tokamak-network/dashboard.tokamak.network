const { toChecksumAddress } = require('web3-utils');

const GET = (db, req) => {
  let rootchain;
  try {
    rootchain = toChecksumAddress(req.query.rootchain);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const operator = db.get('operators').find({ rootchain: rootchain }).value();
    if (operator) {
      return Promise.resolve(operator.genesis);
    } else {
      throw new Error('No record');
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
};
