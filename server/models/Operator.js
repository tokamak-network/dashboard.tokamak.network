const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OperatorScheme = new Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rootchain: {
    type: String,
    required: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    required: true,
  },
  genesis: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('operator', OperatorScheme);
