const GET = (db) => {
  try {
    const chainIds = db
      .get('operators')
      .map('chainId')
      .value();

    return Promise.resolve(chainIds);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
};
