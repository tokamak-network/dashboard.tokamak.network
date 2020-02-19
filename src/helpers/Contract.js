import TruffleContract from '@truffle/contract';

import store from '@/store/index.js';

export async function createTruffleContract (abi, address) {
  const web3 = store.state.web3;
  let contract;
  // TODO: fix
  try {
    contract = TruffleContract({ abi });
    contract.setProvider(web3.currentProvider);
    return await contract.at(address);
  } catch (e) {
    console.log(e.message);
  }
}
