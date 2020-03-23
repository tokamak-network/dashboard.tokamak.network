const { toChecksumAddress } = require('web3-utils');

const GET = (db, req) => {
  let user;
  try {
    user = toChecksumAddress(req.query.user);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const history = db
    .defaults({ history: [] })
    .get('history')
    .filter(history => history.user === user)
    .value();

  return Promise.resolve(history);
};

const POST = async (db, req) => {
  let user;
  try {
    user = toChecksumAddress(req.query.user);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  await db
    .defaults({ history: [] })
    .get('history')
    .push(req.body)
    .last()
    .assign({ user })
    .write();
};

module.exports = {
  GET,
  POST,
};
