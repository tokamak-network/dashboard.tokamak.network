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
    const managers = db
      .get('managers')
      .value();

    if (managers) {
      throw new Error('Already set');
    }
  } catch (err) {
    throw err;
  }

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
