const express = require('express');
const app = express();

const args = process.argv.slice(2);
const network = args[0] || 'mainnet';

const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get(`mongo_${network}`);
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose
  .connect(mongoURI, options)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use('/avatars', express.static(path.join(__dirname, '..', 'avatars')));

const routes = require('./routes');
app.use('/', routes);

const port = config.get(`port_${network}`);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
