const Manager = require('../models/Manager');

const GET = async () => {
  try {
    const managers = await Manager.find();
    if (managers.length > 0) {
      return Promise.resolve(managers[0]);
    } else {
      throw new Error('No record');
    }
  } catch (err) {
    throw err;
  }
};

// only from CURL
const POST = async (req) => {
  try {
    const managers = await Manager.find();
    if (managers.length !== 0) {
      throw new Error('Already set');
    }

    await new Manager(req.body).save();
    return Promise.resolve('The managers has been registered\n');
  } catch (err) {
    throw err;
  }
};

module.exports = {
  GET,
  POST,
};
