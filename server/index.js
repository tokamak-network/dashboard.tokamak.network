const express = require('express');
const app = express();

const mongoose = require('mongoose');
const config = require('config');
const mongoURI = config.get('mongoURI');
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

app.listen(9000, () => {
  console.log('Server listening on http://localhost:9000');
});
