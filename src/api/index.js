import axios from 'axios';
import config from '../../config.json';

function createInstance () {
  return axios.create({
    baseURL: config.baseURL,
  });
}

const instance = createInstance();

export async function getManagers () {
  const res = await instance.get('/managers');
  return res.data;
}

export async function getOperators () {
  const res = await instance.get('/operators');
  return res.data;
}

export async function updateOperator (rootchain, formData) {
  await instance.patch(
    '/operators',
    formData,
    {
      params: {
        rootchain: rootchain,
      },
    });
}

export async function getHistory (user) {
  const res = await instance.get('/history', {
    params: {
      account: user,
    },
  });
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

export async function getPendingTransactions (user) {
  const res = await instance.get('/transactions', {
    params: {
      account: user,
      state: 'pending',
    },
  });
  return res.data;
}

export async function addTransaction (user, hash) {
  await instance.post(
    '/transactions',
    { transactionHash: hash },
    {
      params: {
        account: user,
      },
    });
}

// `pending` -> `mined`
export async function updateTransactionState (hash) {
  await instance.patch(
    '/transactions',
    {
      transactionHash: hash,
    }
  );
}
