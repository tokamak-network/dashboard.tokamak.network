const util = require('util');
const multer = require('multer');
const path = require('path');
const dir = path.join(__dirname, '..', '..', 'avatars');
const upload = multer({
  dest: dir,
});

const { toChecksumAddress } = require('web3-utils');
const Operator = require('../models/Operator');

const GET = async () => {
  try {
    return Promise.resolve(await Operator.find());
  } catch (err) {
    throw err;
  }
};

// only from CURL
const POST = async (req) => {
  try {
    const genesis = JSON.parse(req.body.genesis);
    const rootchain = toChecksumAddress(genesis.extraData);
    const chainId = genesis.config.chainId;

    let operator;
    operator = await Operator.findOne({ rootchain: rootchain });
    if (operator !== null) {
      throw new Error('Already registered');
    }

    operator = await Operator.findOne({ chainId: chainId });
    if (operator !== null) {
      throw new Error('Duplicate chain id');
    }

    const randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) +',' +
                               (Math.floor(Math.random() * 256)) + ',' +
                               (Math.floor(Math.random() * 256)) + ')';
    operator = {};
    operator.name = req.body.name;
    operator.website = req.body.website;
    operator.description = req.body.description;
    operator.rootchain = rootchain; // use checksum address
    operator.chainId = chainId;
    operator.avatar = '';
    operator.color = randomColor;
    operator.genesis = genesis;

    await new Operator(operator).save();
    return Promise.resolve(`The ${operator.name} operator has been registered\n`);
  } catch (err) {
    throw err;
  }
};

const PATCH = async (req) => {
  const uploadPromise = util.promisify(upload.single('avatar'));
  try {
    await uploadPromise(req, {});
  } catch (err) {
    throw err;
  }

  try {
    let rootchain;
    try {
      rootchain = toChecksumAddress(req.query.rootchain);
    } catch (err) {
      throw new Error('Non-checksum address');
    }

    const operator = await Operator.findOne({ rootchain: rootchain });
    if (operator === null) {
      throw new Error('Unregistered operator');
    }
    operator.name = req.body.name ? req.body.name : operator.name;
    operator.website = req.body.website ? req.body.website : operator.website;
    operator.description = req.body.description ? req.body.description : operator.description;
    operator.avatar = req.file ? req.file.filename : operator.avatar;

    const updatedOperator = await operator.save();
    return Promise.resolve(updatedOperator);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
  PATCH,
};
