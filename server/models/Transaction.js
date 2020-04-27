const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  from: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('transaction', TransactionSchema);
