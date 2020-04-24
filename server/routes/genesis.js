const { toChecksumAddress } = require('web3-utils');
const Operator = require('../models/Operator');

const GET = async (req) => {
  let rootchain;
  try {
    rootchain = toChecksumAddress(req.query.rootchain);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const operator = await Operator.findOne({ rootchain: rootchain });
    if (operator !== null) {
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
