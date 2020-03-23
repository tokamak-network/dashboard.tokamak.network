const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/avatars', express.static(__dirname + '/../db/avatars'));

const routes = require('./routes');
app.use('/', routes);

app.listen(9000, () => {
  console.log('Server listening on http://localhost:9000');
});
