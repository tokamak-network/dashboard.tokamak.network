const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
const args = process.argv.slice(2);
switch (args[0]) {
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

app.listen(9000, () => {
  console.log('Server listening on http://localhost:9000');
});
