import Web3 from 'web3';

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
  const web3 = new Web3(provider);

  const metamaskAccount = await _getMetamaskAccount(web3);
  const networkId = await _getNetworkId(web3);
  const balance = await _getTokenBalance(web3, metamaskAccount);
  return {
    web3,
    isConnected: true,
    account: metamaskAccount,
    networkId: networkId.toString(),
    balance: balance.toString(),
  };
};

async function _getMetamaskAccount (web3) {
  const metamaskAccount = (await web3.eth.getAccounts())[0];
  return metamaskAccount;
}

async function _getNetworkId (web3) {
  const networkId = (await web3.eth.net.getId());
  return networkId;
}

async function _getTokenBalance (web3, account) {
  const balanceOfABI = [
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
  const contract = new web3.eth.Contract(balanceOfABI, process.env.VUE_APP_TOKEN_CONTRACT);
  const balance = await contract.methods.balanceOf(account).call();
  // const decimals = await contract.methods.decimals().call();
  // return balance.div(10**decimals);
  return balance;
}

const mm = {
  accessMetamaskWallet,
};

export default mm;
