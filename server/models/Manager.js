const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManagerScheme = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  TON: {
    type: String,
    required: true,
  },
  WTON: {
    type: String,
    required: true,
  },
  DepositManager: {
    type: String,
    required: true,
  },
  RootChainRegistry: {
    type: String,
    required: true,
  },
  SeigManager: {
    type: String,
    required: true,
  },
  PowerTON: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('manager', ManagerScheme);
