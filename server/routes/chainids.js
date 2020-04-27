const Operator = require('../models/Operator');

const GET = async () => {
  try {
    const operators = await Operator.find();
    const chainIds = operators.map(operator => operator.chainId);

    return Promise.resolve(chainIds);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
};
