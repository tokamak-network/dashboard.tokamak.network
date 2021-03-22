import store from '@/store/index.js';

export function createWeb3Contract (abi, address, web3, from) {
  try {
    return new web3.eth.Contract(abi, address, {
      from,
    });
  } catch (e) {
    // console.log(e);
  }
}
