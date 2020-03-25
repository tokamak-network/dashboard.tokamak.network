const { toChecksumAddress } = require('web3-utils');

const GET = (db, req) => {
  let account;
  try {
    account = toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  const history = db
    .defaults({ history: [] })
    .get('history')
    .filter(history => history.account === account)
    .value();

  return Promise.resolve(history);
};

const POST = async (db, req) => {
  let account;
  try {
    account = toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  await db
    .defaults({ history: [] })
    .get('history')
    .push(req.body)
    .last()
    .assign({ account })
    .write();
};

module.exports = {
  GET,
  POST,
};
