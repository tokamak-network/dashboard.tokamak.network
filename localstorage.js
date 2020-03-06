if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./localstorage');
}

function addHistory (user, history) {
  let userHistory = getHistory(user);
  if (!userHistory) userHistory = [];

  userHistory.push(history);
  localStorage.setItem(`user-${user}-history`, JSON.stringify(userHistory));

  return userHistory;
}
module.exports.addHistory = addHistory;

function getHistory (user) {
  const userHistory = localStorage.getItem(`user-${user}-history`);
  if (!userHistory) return [];
  else return JSON.parse(userHistory);
}
module.exports.getHisotry = getHistory;

function updateRootchainRegistry (rootchain, newRegistry) {
  const registry = getRootchainRegistry(rootchain);
  for (const key in registry){
    registry[key] = newRegistry[key] || registry[key];
  }

  localStorage.setItem(`rootchain-${rootchain}-registry`, JSON.stringify(registry));
}
module.exports.updateRootchainRegistry = updateRootchainRegistry;

const initialRegistry = {
  avatar: '',
  name: '',
  website: '',
  description: '',
};
function getRootchainRegistry (rootchain) {
  const registry = localStorage.getItem(`rootchain-${rootchain}-registry`);
  if (!registry) return initialRegistry;
  else return JSON.parse(registry);
}
module.exports.getRootchainRegistry = getRootchainRegistry;
