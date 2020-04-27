const { toChecksumAddress } = require('web3-utils');
const Transaction = require('../models/Transaction');

const GET = async (req) => {
  let from;
  try {
    from = toChecksumAddress(req.query.from);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    return Promise.resolve(await Transaction.find({ from: from }));
  } catch (err) {
    throw err;
  }
};

const POST = async (req) => {
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
    const newTransaction = await new Transaction(transaction).save();
    return Promise.resolve(newTransaction);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
};
