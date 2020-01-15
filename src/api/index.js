import axios from 'axios';

function createInstance () {
  return axios.create ({});
}

const instance = createInstance();

async function sample () {
  return (await instance.get('https://jsonplaceholder.typicode.com/todos/1')).data;
}

const api = {
  sample,
};

export default api;
