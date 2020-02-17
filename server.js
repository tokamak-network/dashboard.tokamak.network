const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./localstorage');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const homeDir = require('os').homedir();
const plsStakingDir = path.join(homeDir, '.pls.staking');

app.get('/', function (_, res) {
  const managers = JSON.parse(fs.readFileSync(`${plsStakingDir}/managers.json`));
  const rootchains = JSON.parse(fs.readFileSync(`${plsStakingDir}/rootchains.json`));

  return res.status(200).json({
    managers,
    rootchains,
  });
});

app.get('/managers', function (_, res) {
  const managers = JSON.parse(fs.readFileSync(`${plsStakingDir}/managers.json`));

  return res.status(200).json({
    managers,
  });
});

app.get('/rootchains', function (_, res) {
  const rootchains = JSON.parse(fs.readFileSync(`${plsStakingDir}/rootchains.json`));

  return res.status(200).json({
    rootchains,
  });
});

app.get('/history/:user', function (req, res) {
  const user = (req.params.user).toLowerCase();
  const history = db.getHisotry(user);

  return res.status(200).json({
    history,
  });
});

app.post('/managers', function (req, res) {
  const managers = req.body.managers;
  fs.writeFileSync(`${plsStakingDir}/managers.json`, JSON.stringify(managers));

  return res.status(200).json({});
});

app.post('/rootchains', function (req, res) {
  let rootchains = JSON.parse(fs.readFileSync(`${plsStakingDir}/rootchains.json`));
  if (!rootchains) rootchains = [];

  rootchains.push(req.body.rootchain);
  fs.writeFileSync(`${plsStakingDir}/rootchains.json`, JSON.stringify(rootchains));

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
  fs.writeFileSync(`${plsStakingDir}/rootchains.json`, JSON.stringify([]));
  fs.writeFileSync(`${plsStakingDir}/managers.json`, JSON.stringify({}));

  return res.status(200).json({});
});

app.listen(9000, function () {
  console.log('Server listening on port 9000');
});
