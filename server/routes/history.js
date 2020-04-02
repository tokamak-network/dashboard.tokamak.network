const { toChecksumAddress } = require('web3-utils');

const GET = (db, req) => {
  let account;
  try {
    account = toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    const history = db
      .get('history')
      .filter(history => history.account === account)
      .value();

    return Promise.resolve(history);
  } catch (err) {
    throw err;
  }
};

const POST = async (db, req) => {
  let account;
  try {
    account = toChecksumAddress(req.query.account);
  } catch (err) {
    throw new Error('Non-checksum address');
  }

  try {
    await db
      .defaults({ history: [] })
      .get('history')
      .push(req.body)
      .last()
      .assign({ account })
      .write();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
};
