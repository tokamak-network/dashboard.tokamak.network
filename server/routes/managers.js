const GET = (db) => {
  try {
    const managers = db
      .defaults({ managers: {} })
      .get('managers')
      .value();

    return Promise.resolve(managers);
  } catch (err) {
    throw err;
  }
};

// only from CURL
const POST = async (db, req) => {
  try {
    await db
      .defaults({ managers: {} })
      .get('managers')
      .assign(req.body)
      .write();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
};
