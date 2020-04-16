const express = require('express');
const router = express.Router();

const CustomError = require('../CustomError');

const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const args = process.argv.slice(2);

const fs = require('fs');
const path = require('path');

let dir;
switch (args[0]) {
case 'rinkeby':
  dir = path.join(__dirname, '..', '..', 'db', 'rinkeby');
  break;
case 'development':
  dir = path.join(__dirname, '..', '..', 'db', 'development');
  break;
default:
  dir = path.join(__dirname, '..', '..', 'db', 'mainnet');
  break;
}

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
  fs.mkdirSync(path.join(dir, 'avatars'));
}
const adapter = new FileAsync(path.join(dir, 'db.json'));

router.use(async (req, res) => {
  lowdb(adapter)
    .then(async db => {
      req.network = args[0];

      const index = req.path.indexOf('/', 1);
      const path = index > 0 ? req.path.slice(0, index) : req.path;
      try {
        const route = require(`.${path}`)[req.method];

        try {
          const result = await route(db, req);
          res.status(200).send(result);
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.status).send({
              error: err.code,
              description: err.message,
            });
          } else {
            return res.status(500).send({
              error: err.message,
              description: 'Something went wrong. Please try again or contact support.',
            });
          }
        }
      } catch (err) {
        res.status(404).send({
          error: 'NOT_FOUND',
          description: 'The resource you tried to access does not exist.',
        });
      }
    });
});

module.exports = router;
