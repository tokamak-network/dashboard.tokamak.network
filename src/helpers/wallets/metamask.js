import Web3 from 'web3';
import Contract from '../Contract';
import getWeb3 from '../getWeb3';

const instance = getWeb3.instance;

const accessMetamaskWallet = async function () {
  if (window.ethereum) {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.log('User denied account access', error);
    }
  } else {
    return {
      isConnected: false,
      errorMessage: '',
    };
  }

  const provider = window.ethereum;
  instance.web3 = new Web3(provider);

  const metamaskAccount = await _getMetamaskAccount();
  const networkId = await _getNetworkId();
  const balance = await _getTokenBalance(metamaskAccount);

  return {
    web3: instance.web3,
    isConnected: true,
    account: metamaskAccount,
    networkId: networkId.toString(),
    balance: balance.toString(),
  };
};

async function _getMetamaskAccount () {
  const web3 = instance.web3;
  const metamaskAccount = (await web3.eth.getAccounts())[0];
  return metamaskAccount;
}

async function _getNetworkId () {
  const web3 = instance.web3;
  const networkId = (await web3.eth.net.getId());
  return networkId;
}

async function _getTokenBalance (account) {
  const abi = [
    // balanceOf
    {
      'constant':true,
      'inputs':[{ 'name':'_owner', 'type':'address' }],
      'name':'balanceOf',
      'outputs':[{ 'name':'balance', 'type':'uint256' }],
      'type':'function',
    },
    // decimals
    {
      'constant':true,
      'inputs':[],
      'name':'decimals',
      'outputs':[{ 'name':'', 'type':'uint8' }],
      'type':'function',
    },
  ];
  const contract = new Contract(abi, process.env.VUE_APP_TOKEN_CONTRACT);
  const balance = await contract.staticCall('balanceOf', [ account ]);
  // const decimals = await contract.methods.decimals().call();
  // return balance.div(10**decimals);
  return balance;
}

const mm = {
  accessMetamaskWallet,
};

export default mm;
