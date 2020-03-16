const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');

// TODO: localstorage/avartars
const upload = multer({
  dest: './localstorage/avatars',
});
app.use('/avatars', express.static(__dirname + '/localstorage/avatars'));

const db = require('./localstorage');
const fs = require('fs');
const localstorageDir = `${__dirname}/localstorage`;

app.get('/', function (_, res) {
  const managers = JSON.parse(fs.readFileSync(`${localstorageDir}/managers.json`));
  const rootchains = JSON.parse(fs.readFileSync(`${localstorageDir}/rootchains.json`));

  return res.status(200).json({
    managers,
    rootchains,
  });
});

app.get('/managers', function (_, res) {
  const managers = JSON.parse(fs.readFileSync(`${localstorageDir}/managers.json`));

  return res.status(200).json(managers);
});

app.get('/rootchains', function (_, res) {
  const rootchains = JSON.parse(fs.readFileSync(`${localstorageDir}/rootchains.json`));

  return res.status(200).json(rootchains);
});

app.get('/history/:user', function (req, res) {
  const user = (req.params.user).toLowerCase();
  const history = db.getHisotry(user);

  return res.status(200).json({
    history,
  });
});

app.get('/registry/:rootchain', function (req, res) {
  const rootchain = (req.params.rootchain).toLowerCase();
  const registry = db.getRootchainRegistry(rootchain);

  return res.status(200).json({
    registry,
  });
});

app.post('/registry/:rootchain', upload.single('avatar'), function (req, res) {
  const rootchain = (req.params.rootchain).toLowerCase();

  const registry = {};
  if (req.file) {
    const avatar = req.file.filename;
    registry.avatar = avatar;
  }
  registry.name = req.body.name;
  registry.website = req.body.website;
  registry.description = req.body.description;

  db.updateRootchainRegistry(rootchain, registry);

  return res.status(200).json({});
});

app.post('/managers', function (req, res) {
  const managers = req.body;
  fs.writeFileSync(`${localstorageDir}/managers.json`, JSON.stringify(managers));

  return res.status(200).json({});
});

app.post('/rootchains', function (req, res) {
  const rootchain = req.body.extraData;

  let rootchains;
  try {
    rootchains = JSON.parse(fs.readFileSync(`${localstorageDir}/rootchains.json`));
  } catch (err) {
    rootchains = [];
  }

  rootchains.push(rootchain);
  fs.writeFileSync(`${localstorageDir}/rootchains.json`, JSON.stringify(rootchains));

  return res.status(200).json({});
});

app.post('/history/:user', function (req, res) {
  const user = (req.params.user).toLowerCase();
  const history = req.body.history;
  const userHistory = db.addHistory(user, history);

  return res.status(200).json({
    history: userHistory,
  });
});

app.delete('/', function (_, res) {
  fs.writeFileSync(`${localstorageDir}/rootchains.json`, JSON.stringify([]));
  fs.writeFileSync(`${localstorageDir}/managers.json`, JSON.stringify({}));

  return res.status(200).json({});
});

app.listen(9000, function () {
  console.log('Server listening on port 9000');
});
