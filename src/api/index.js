import axios from 'axios';
import { getConfig } from '../../config.js';

function createInstance () {
  return axios.create({
    baseURL: getConfig().baseURL,
  });
}

function createInstatnceCandidate () {
  return axios.create({
    baseURL: getConfig().candidate,
  });
}

const candidate = createInstatnceCandidate();
const instance = createInstance();

export async function getDailyStakedTotal (chainId) {
  const res = await candidate.get('/stakedtotals', {
    params: {
      chainId: chainId,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getOperatorsInfo () {
  const res = await candidate.get('/layer2s/operators', {
    params: {
      chainId: 4,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getRankList () {
  const res = await candidate.get('/poweraccounts', {
    params:{
      chainId:1,
      pagesize:300,
      sort:'powerBalance',
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getWinnerList () {
  const res = await candidate.get('/events', {
    params:{
      chainId:1,
      eventName:'RoundEnd',
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getCandidateCreateEvent () {
  const res = await candidate.get('/events', {
    params: {
      eventNames: 'CandidateContractCreated,Layer2Registered',
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

// export async function getWalletTotalStaked (chainId, account, fromDate, toDate) {
//   const res = await candidate.get('/stakedl2accounts/sum', {
//     params: {
//       chainId: chainId,
//       account: account,
//       fromDate: fromDate,
//       toDate: toDate,
//     },
//   });
//   if (res.data === '') return [];
//   else return res.data.datas;
// }

export async function getDailyWalletRewards (chainId, account, fromDate, toDate) {
  const res = await candidate.get('/stakedl2accounts/rewards', {
    params: {
      chainId,
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}

export async function getDailyWalletStaked (chainId, account, fromDate, toDate) {
  const res = await candidate.get('/stakedl2accounts/sum', {
    params: {
      chainId,
      account: account.toLowerCase(),
      fromDate: fromDate,
      toDate: toDate,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getDelegators (chainId, layer2) {
  const res = await candidate.get('/layer2users', {
    params: {
      chainId: chainId,
      layer2: layer2,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getCommitHistory (chainId, layer2) {
  const res = await candidate.get('/events', {
    params: {
      chainId: chainId,
      eventName: 'Comitted',
      layer2: layer2,
      page: 1,
      pagesize: 100,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getAccumulatedReward (chainId, user) {
  const res = await candidate.get('/stakedl2accounts/totalRewards', {
    params: {
      chainId: chainId,
      account: user,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getPowerTONInfo () {
  const res = await candidate.get('events', {
    params: {
      chainId: 1,
      eventName: 'RoundStart',
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getCandidates () {
  const res = await candidate.get('/layer2s/operators');
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getRoundReward (chainId) {
  const res = await candidate.get('/powertons', {
    params: {
      chainId: chainId,
    },
  });
  if (res.data === '') return [];
  else return res.data.datas;
}
export async function getManagers () {
  const res = await instance.get('/managers');
  if (res.data === '') return [];
  else return res.data;
}

export async function getOperators () {
  const res = await instance.get('/operators');
  if (res.data === '') return [];
  else return res.data;
}

export async function updateOperator (layer2, formData) {
  const res = await instance.patch(
    '/operators',
    formData,
    {
      params: {
        layer2: layer2,
      },
    });
  return res.data;
}

export async function getHistory (user) {
  const res = await instance.get('/history', {
    params: {
      account: user,
    },
  });
  return res.data;
}

export async function getTotalSupply () {
  const res =  await axios.get('https://price-api.tokamak.network/totalsupply');
  return res.data;
}
export async function addHistory (user, history) {
  await instance.post(
    '/history',
    { history },
    {
      params: {
        account: user,
      },
    });
}

export async function getTransactions (user) {
  const res = await instance.get('/transactions', {
    params: {
      from: user,
    },
  });
  if (res.data === '') return [];
  else return res.data;
}

export async function addTransaction (transaction) {
  const res = await instance.post(
    '/transactions',
    {
      type: transaction.type,
      amount: transaction.amount,
      transactionHash: transaction.transactionHash,
      target: transaction.target,
      receipt: transaction.receipt,
    },
    {
      params: {
        from: transaction.from,
      },
    });
  return res.data;
}
