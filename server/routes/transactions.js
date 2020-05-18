const { toChecksumAddress } = require('web3-utils');

// only get pending transactions
const GET = (db, req) => {
  let from = req.query.from;
  if (from) {
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
  } else {
    const transactions = db
      .get('transactions')
      .value();

    return Promise.resolve(transactions);
  }
};

const POST = async (db, req) => {
  let from;
  try {
    from = toChecksumAddress(req.query.from);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const transaction = {};
  transaction.from = from;
  transaction.type = req.body.type;
  transaction.amount = req.body.amount;
  transaction.transactionHash = req.body.transactionHash;
  transaction.target = req.body.target;
  transaction.status = req.body.receipt.status;
  transaction.blockNumber = req.body.receipt.blockNumber;

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
