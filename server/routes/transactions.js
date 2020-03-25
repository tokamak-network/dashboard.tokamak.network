const { toChecksumAddress } = require('web3-utils');

// only get pending transactions
const GET = (db, req) => {
  try {
    toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const account = (req.query.account).toLowerCase();
    const state = req.query.state;
    const transactions = db
      .defaults({ transactions: [] })
      .get('transactions')
      .filter(transaction => transaction.account === account && transaction.state === state)
      .value();

    return Promise.resolve(transactions);
  } catch (err) {
    throw err;
  }
};

// put new pending transaction
const POST = async (db, req) => {
  try {
    toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const account = (req.query.account).toLowerCase();
  const transaction = {};
  transaction.account = account;
  transaction.hash = req.body.transactionHash;
  transaction.state = 'pending';

  try {
    await db
      .defaults({ transactions: [] })
      .get('transactions')
      .push(transaction)
      .write();
  } catch (err) {
    throw err;
  }
};

// update transaction state
const PATCH = async (db, req) => {
  const transactionHash = req.body.transactionHash;

  try {
    await db
      .defaults({ transactions: [] })
      .get('transactions')
      .find({ hash: transactionHash })
      .assign({ state: 'mined ' })
      .write();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
  PATCH,
};
