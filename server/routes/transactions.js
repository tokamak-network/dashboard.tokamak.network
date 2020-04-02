const { toChecksumAddress } = require('web3-utils');

// only get pending transactions
const GET = (db, req) => {
  let from;
  try {
    from = toChecksumAddress(req.query.from);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const transactions = db
      .get('transactions')
      .filter(transaction => transaction.from === from)
      .value();

    return Promise.resolve(transactions);
  } catch (err) {
    throw err;
  }
};

// put new pending transaction
const POST = async (db, req) => {
  let from;
  try {
    from = toChecksumAddress(req.query.from);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const transaction = {};
  transaction.from = from;
  transaction.transactionHash = req.body.transactionHash;
  transaction.target = req.body.target;

  try {
    await db
      .defaults({ transactions: [] })
      .get('transactions')
      .push(transaction)
      .write();

    return Promise.resolve(transaction);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
};
