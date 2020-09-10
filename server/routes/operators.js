const util = require('util');
const multer = require('multer');
const path = require('path');
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
  let genesis;
  if (typeof(req.body.genesis) === 'object') {
    genesis = req.body.genesis;
  } else {
    genesis = JSON.parse(req.body.genesis);
  }

  let layer2, chainId, operator;
  try {
    layer2 = toChecksumAddress(genesis.extraData);
    chainId = genesis.config.chainId;

    operator = db.get('operators').find({ layer2: layer2 }).value();
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
  newOperator.layer2 = layer2; // use checksum address
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
  let dir;
  switch (req.network) {
  case 'rinkeby':
    dir = path.join(__dirname, '..', '..', 'db', 'rinkeby', 'avatars');
    break;
  case 'development':
    dir = path.join(__dirname, '..', '..', 'db', 'development', 'avatars');
    break;
  default:
    dir = path.join(__dirname, '..', '..', 'db', 'mainnet', 'avatars');
    break;
  }
  const upload = multer({
    dest: dir,
  });

  const uploadPromise = util.promisify(upload.single('avatar'));
  try {
    await uploadPromise(req, {});
  } catch (err) {
    throw err;
  }

  let layer2;
  try {
    layer2 = toChecksumAddress(req.query.layer2);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const operator = db.get('operators').find({ layer2: layer2 }).value();
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
      .find({ layer2: layer2 })
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
