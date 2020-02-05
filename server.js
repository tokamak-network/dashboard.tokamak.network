const http = require('http');
const path = require('path');
const fs = require('fs');

http.createServer((_, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const homeDir = require('os').homedir();
  const plsStakingDir = path.join(homeDir, '.pls.staking');

  const managers = JSON.parse(fs.readFileSync(`${plsStakingDir}/managers.json`));
  const rootchains = JSON.parse(fs.readFileSync(`${plsStakingDir}/rootchains.json`));

  res.end(JSON.stringify({
    managers,
    rootchains,
  }));
}).listen(9000);

console.log('Server listening on port 9000');
