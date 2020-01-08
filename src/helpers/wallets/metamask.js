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

  const metamaskAccount = await _getMetamaskAccount();
  const networkId = await _getNetworkId();
  const balance = await _getTokenBalance(metamaskAccount);
  return {
    isConnected: true,
    account: metamaskAccount,
    networkId: networkId.toString(),
    balance: balance.toString(),
  };
};

async function _getMetamaskAccount () {
  const provider = window.ethereum;
  const web3 = new Web3(provider);

  const metamaskAccount = (await web3.eth.getAccounts())[0];
  return metamaskAccount;
}

async function _getNetworkId () {
  const provider = window.ethereum;
  const web3 = new Web3(provider);

  const networkId = (await web3.eth.net.getId());
  return networkId;
}

async function _getTokenBalance (account) {
  const provider = window.ethereum;
  const web3 = new Web3(provider);

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
  const address = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
  const contract = new web3.eth.Contract(balanceOfABI, address);

  const balance = await contract.methods.balanceOf(account).call();
  // const decimals = await contract.methods.decimals().call();
  // return balance.div(10**decimals);
  return balance;
}

const mm = {
  accessMetamaskWallet,
};

export default mm;
