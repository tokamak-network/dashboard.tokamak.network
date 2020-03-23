const GET = (db) => {
  const managers = db
    .defaults({ managers: {} })
    .get('managers')
    .value();

  return Promise.resolve(managers);
};

// only from CURL
const POST = async (db, req) => {
  await db
    .defaults({ managers: {} })
    .get('managers')
    .assign(req.body)
    .write();
};

module.exports = {
  GET,
  POST,
};
