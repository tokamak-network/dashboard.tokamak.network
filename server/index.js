const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const args = process.argv.slice(2);
const network = args[0] || 'mainnet';
// console.log(network);
const path = require('path');
switch (network) {
case 'rinkeby':
  app.use('/avatars', express.static(path.join(__dirname, '..', 'db', 'rinkeby', 'avatars')));
  break;
case 'development':
  app.use('/avatars', express.static(path.join(__dirname, '..', 'db', 'development', 'avatars')));
  break;
default:
  app.use('/avatars', express.static(path.join(__dirname, '..', 'db', 'mainnet', 'avatars')));
  break;
}

const routes = require('./routes');
app.use('/', routes);

const config = require('../config/default.json');
const port = config[`port_${network}`];
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
