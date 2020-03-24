import axios from 'axios';
import config from '../../config.json';

// TODO: make baseURL environement variable
function createInstance () {
  return axios.create({
    baseURL: config.baseURL,
  });
}

const instance = createInstance();

export async function getOperators () {
  const res = await instance.get('/operators');
  return res.data;
}

export async function getManagers () {
  const res = await instance.get('/managers');
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
  const res = await instance.post(
    '/history',
    { history },
    {
      params: {
        account: user,
      },
    });
  return res.data.history;
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
  return res.data.operators;
}
