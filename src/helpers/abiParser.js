const fs = require('fs');
const path = require('path');
const abiPath = path.join(__dirname, '..', 'contracts', 'abi');

const TON = require('../contracts/TON.json');
const WTON = require('../contracts/WTON.json');
const DepositManager = require('../contracts/DepositManager.json');
const Layer2Registry = require('../contracts/Layer2Registry.json');
const SeigManager = require('../contracts/SeigManager.json');
const PowerTON = require('../contracts/PowerTON.json');
const Layer2 = require('../contracts/Layer2.json');
const AutoRefactorCoinage = require('../contracts/AutoRefactorCoinage.json');

const TONABI = TON.abi;
const WTONABI = WTON.abi;
const DepositManagerABI = DepositManager.abi;
const Layer2RegistryABI = Layer2Registry.abi;
const SeigManagerABI = SeigManager.abi;
const PowerTONABI = PowerTON.abi;
const Layer2ABI = Layer2.abi;
const AutoRefactorCoinageABI = AutoRefactorCoinage.abi;
const ABIs = {
  TON: TONABI,
  WTON: WTONABI,
  DepositManager: DepositManagerABI,
  Layer2RegistryABI: Layer2RegistryABI,
  SeigManager: SeigManagerABI,
  PowerTON: PowerTONABI,
  Layer2: Layer2ABI,
  AutoRefactorCoinage: AutoRefactorCoinageABI,
};

for (const [name, abi] of Object.entries(ABIs)) {
  fs.writeFileSync(`${abiPath}/${name}.json`, JSON.stringify(abi), 'utf8', function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }

    console.log('JSON file has been saved.');
  });
}
