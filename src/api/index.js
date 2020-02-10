import axios from 'axios';

function createInstance () {
  return axios.create({
    baseURL: 'http://127.0.0.1:9000',
  });
}

const instance = createInstance();

// TODO: make router.
export async function getState () {
  const res = await instance.get('/');
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
