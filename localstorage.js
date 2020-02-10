if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./localstorage');
}

function addHistory (user, history) {
  let userHistory = getHistory(user);
  if (!userHistory) userHistory = [];

  userHistory.add(history);
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
