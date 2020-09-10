const { toChecksumAddress } = require('web3-utils');

const GET = (db, req) => {
  let layer2;
  try {
    layer2 = toChecksumAddress(req.query.layer2);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const operator = db.get('operators').find({ layer2: layer2 }).value();
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
