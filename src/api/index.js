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
  const res = await instance.patch(
    '/operators',
    formData,
    {
      params: {
        rootchain: rootchain,
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
  return res.data;
}

export async function addTransaction (transaction) {
  const res = await instance.post(
    '/transactions',
    { transactionHash: transaction.transactionHash,
      target: transaction.target,
    },
    {
      params: {
        from: transaction.from,
      },
    });
  return res.data;
}
