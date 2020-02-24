import axios from 'axios';

function createInstance () {
  return axios.create({
    baseURL: `http://${window.location.hostname}:9000`,
  });
}

const instance = createInstance();

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
