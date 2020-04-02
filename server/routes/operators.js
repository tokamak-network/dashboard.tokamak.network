const util = require('util');
const multer = require('multer');
const upload = multer({
  dest: `${__dirname}/../../db/avatars`,
});

const { toChecksumAddress } = require('web3-utils');

const GET = (db) => {
  try {
    const operators = db
      .get('operators')
      .value();

    return Promise.resolve(operators);
  } catch (err) {
    throw err;
  }
};

// only from CURL
const POST = async (db, req) => {
  const genesis = JSON.parse(req.body.genesis);

  let rootchain, chainId, operator;
  try {
    rootchain = toChecksumAddress(genesis.extraData);
    chainId = genesis.config.chainId;

    operator = db.get('operators').find({ rootchain: rootchain }).value();
    if (operator) {
      throw new Error('Already registered');
    }

    operator = db.get('operators').find({ chainId: chainId }).value();
    if (operator) {
      throw new Error('Duplicate chain id');
    }
  } catch (err) {
    throw err;
  }

  const randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) +',' +
                             (Math.floor(Math.random() * 256)) + ',' +
                             (Math.floor(Math.random() * 256)) + ')';
  const newOperator = {};
  newOperator.name = req.body.name;
  newOperator.website = req.body.website;
  newOperator.description = req.body.description;
  newOperator.rootchain = rootchain; // use checksum address
  newOperator.chainId = chainId;
  newOperator.avatar = '';
  newOperator.color = randomColor;
  newOperator.genesis = genesis;

  try {
    await db
      .defaults({ operators: [] })
      .get('operators')
      .push(newOperator)
      .write();
  } catch (err) {
    throw err;
  }
};

const PATCH = async (db, req) => {
  const uploadPromise = util.promisify(upload.single('avatar'));
  try {
    await uploadPromise(req, {});
  } catch (err) {
    throw err;
  }

  let rootchain;
  try {
    rootchain = toChecksumAddress(req.query.rootchain);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const operator = db.get('operators').find({ rootchain: rootchain }).value();
  if (!operator) {
    throw new Error('Unregistered operator');
  }
  operator.name = req.body.name ? req.body.name : operator.name;
  operator.website = req.body.website ? req.body.website : operator.website;
  operator.description = req.body.description ? req.body.description : operator.description;
  operator.avatar = req.file ? req.file.filename : operator.avatar;

  // https://github.com/typicode/lowdb/issues/111
  try {
    await db
      .defaults({ operators: [] })
      .get('operators')
      .find({ rootchain: rootchain })
      .assign(operator)
      .write();

    return Promise.resolve(operator);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
  PATCH,
};
