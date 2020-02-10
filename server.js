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

app.get('/', function (_, res) {
  const homeDir = require('os').homedir();
  const plsStakingDir = path.join(homeDir, '.pls.staking');

  const managers = JSON.parse(fs.readFileSync(`${plsStakingDir}/managers.json`));
  const rootchains = JSON.parse(fs.readFileSync(`${plsStakingDir}/rootchains.json`));

  return res.status(200).json({
    managers,
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

app.post('/history/:user', function (req, res) {
  const user = (req.params.user).toLowerCase();
  const history = req.body.history;
  const userHistory = db.addHistory(user, history);

  return res.status(200).json({
    history: userHistory,
  });
});

app.listen(9000, function () {
  console.log('Server listening on port 9000');
});
