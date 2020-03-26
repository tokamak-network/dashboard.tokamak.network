const util = require('util');
const multer = require('multer');
const upload = multer({
  dest: `${__dirname}/../../db/avatars`,
});

const { toChecksumAddress } = require('web3-utils');

const GET = (db) => {
  try {
    const operators = db
      .defaults({ operators: [] })
      .get('operators')
      .value();

    return Promise.resolve(operators);
  } catch (err) {
    throw err;
  }
};

// only from CURL
const POST = async (db, req) => {
  let rootchain;
  try {
    rootchain = toChecksumAddress(req.body.rootchain);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const randomColor = 'rgb(' + (Math.floor(Math.random() * 256)) +',' +
                             (Math.floor(Math.random() * 256)) + ',' +
                             (Math.floor(Math.random() * 256)) + ')';

  const operator = db.get('operators').find({ rootchain: rootchain }).value();
  if (operator) {
    throw new Error('Already registered');
  }

  const newOperator = {};
  newOperator.rootchain = rootchain; // use checksum address
  newOperator.avatar = '';
  newOperator.color = randomColor;

  try {
    await db
      .defaults({ operators: [] })
      .get('operators')
      .push(req.body)
      .last()
      .assign(newOperator)
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
