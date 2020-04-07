import web3EthContract from 'web3-eth-contract';

export function setProvider (web3) {
  web3EthContract.setProvider(web3.givenProvider);
}

export async function createWeb3Contract (abi, address, from) {
  try {
    return new web3EthContract(abi, address, {
      from,
    });
  } catch (e) {
    //
  }
}
