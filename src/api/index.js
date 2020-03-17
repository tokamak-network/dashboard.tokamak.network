import axios from 'axios';

// TODO: make baseURL environement variable
function createInstance () {
  return axios.create({
    baseURL: 'http://127.0.0.1:9000',
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
  const res = await instance.get(`/history/${user}`);
  return res.data.history;
}

export async function addHistory (user, history) {
  const res = await instance.post(`/history/${user}`, {
    history,
  });
  return res.data.history;
}

export async function updateOperator (rootchain, formData) {
  const res = await instance.put(`/operators/${rootchain}`, formData);
  return res.data.operators;
}
