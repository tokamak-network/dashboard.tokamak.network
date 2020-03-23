const multer = require('multer');
const upload = multer({
  dest: `${__dirname}/../../db/avatars`,
});

const { toChecksumAddress } = require('web3-utils');

const GET = (db) => {
  const operators = db
    .defaults({ operators: [] })
    .get('operators')
    .value();

  return Promise.resolve(operators);
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

  const data = {};
  data.rootchain = rootchain; // use checksum address
  data.avatar = '';
  data.color = randomColor;

  await db
    .defaults({ operators: [] })
    .get('operators')
    .push(req.body)
    .last()
    .assign(data)
    .write();
};

const PATCH = async (db, req) => {
  upload.single('avatar')(req, {}, async function (err) {
    if (err) {
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

    const data = {};
    data.name = req.body.name ? req.body.name : operator.name;
    data.website = req.body.website ? req.body.website : operator.website;
    data.description = req.body.description ? req.body.description : operator.description;
    data.avatar = req.file ? req.file.filename : operator.avatar;

    // https://github.com/typicode/lowdb/issues/111
    await db
      .defaults({ operators: [] })
      .get('operators')
      .find({ rootchain: rootchain })
      .assign(data)
      .write();
  });
};

module.exports = {
  GET,
  POST,
  PATCH,
};
