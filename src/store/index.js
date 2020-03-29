import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import router from '@/router';

import { getManagers, getOperators, getHistory, getTransactions } from '@/api';
import { cloneDeep, isEqual, range, uniq, orderBy } from 'lodash';
import numeral from 'numeral';
import { createWeb3Contract } from '@/helpers/Contract';
import { BN } from 'web3-utils';

import { createCurrency } from '@makerdao/currency';
const _ETH = createCurrency('ETH');
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
const _POWER = createCurrency('POWER');

import TON from '@/contracts/TON.json';
import WTON from '@/contracts/WTON.json';
import DepositManager from '@/contracts/DepositManager.json';
import RootChainRegistry from '@/contracts/RootChainRegistry.json';
import SeigManager from '@/contracts/SeigManager.json';
import PowerTON from '@/contracts/PowerTON.json';
const managerABIs = {
  TONABI: TON.abi,
  WTONABI: WTON.abi,
  DepositManagerABI: DepositManager.abi,
  RootChainRegistryABI: RootChainRegistry.abi,
  SeigManagerABI: SeigManager.abi,
  PowerTONABI: PowerTON.abi,
};
import RootChain from '@/contracts/RootChain.json';
import CustomIncrementCoinage from '@/contracts/CustomIncrementCoinage.json';
const RootChainABI = RootChain.abi;
const CustomIncrementCoinageABI = CustomIncrementCoinage.abi;

const initialState = {
  loading: false,
  signIn: false,

  // transactionss (based on receipt: getTransactionReceipt)
  transactions: [],
  pendingTransactions: [],

  web3: {},
  user: '',
  networkId: '',
  blockNumber: 0,

  // contract of managers
  TON: {},
  WTON: {},
  DepositManager: {},
  RootChainRegistry: {},
  SeigManager: {},
  PowerTON: {},

  // balance
  ethBalance: _ETH('0'),
  tonBalance: _TON('0'),
  wtonBalance: _WTON('0'),
  power: _POWER('0'),

  // operator
  operators: [],

  // round
  currentRound: {},
  rounds: [],

  // user transaction history
  history: [],

  // rank
  accountsDepositedWithPower: [],
};

const getInitialState = () => initialState;

export default new Vuex.Store({
  state: cloneDeep(initialState),
  mutations: {
    SET_INITIAL_STATE: (state) => {
      const initialState = getInitialState();
      Object.keys(initialState).forEach(key => {
        state[key] = initialState[key];
      });
    },
    IS_LOADING: (state, isLoading) => {
      state.loading = isLoading;
    },
    SIGN_IN: (state) => {
      state.signIn = true;
    },
    SET_WEB3: (state, web3) => {
      state.web3 = web3;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_NETWORK_ID: (state, networkId) => {
      state.networkId = networkId;
    },
    SET_BLOCK_NUMBER: (state, number) => {
      state.blockNumber = number;
    },
    SET_ETH_BALANCE: (state, balance) => {
      state.ethBalance = balance;
    },
    SET_TON_BALANCE: (state, balance) => {
      state.tonBalance = balance;
    },
    SET_WTON_BALANCE: (state, balance) => {
      state.wtonBalance = balance;
    },
    SET_POWER: (state, power) => {
      state.power = power;
    },
    SET_MANAGERS: (state, managers) => {
      for (const [name, contract] of Object.entries(managers)) {
        state[name] = contract;
      }
    },
    SET_OPERATORS: (state, operators) => {
      state.operators = operators;
    },
    SET_TRANSACTIONS: (state, transactions) => {
      state.transactions = transactions;
    },
    ADD_TRANSACTION: (state, newTransaction) => {
      const transactions = state.transactions;
      if (!transactions.find(transaction => transaction.transactionHash === newTransaction.transactionHash)) {
        transactions.push(newTransaction);
      }
    },
    ADD_PENDING_TRANSACTION: (state, newPendingTransaction) => {
      const pendingTransactions = state.pendingTransactions;
      if (!pendingTransactions.find(pendingTransaction => pendingTransaction.transactionHash === newPendingTransaction.transactionHash)) {
        pendingTransactions.push(newPendingTransaction);
      }
    },
    UPDATE_TRANSACTION_FROM_PENDING_TO_MINED: (state, minedTransaction) => {
      // delete from pending transactions list
      state.pendingTransactions.splice(state.pendingTransactions.map(pendingTransaction => pendingTransaction.transactionHash).indexOf(minedTransaction.transactionHash), 1);

      const index = state.transactions.map(transaction => transaction.transactionHash).indexOf(minedTransaction.transactionHash);
      Vue.set(state.transactions, index, minedTransaction);
    },
    UPDATE_OPERATOR: (state, newOperator) => {
      const index = state.operators.indexOf(prevOperator);
      const prevOperator = state.operators.find(operator => operator.rootchain === newOperator.rootchain);
      for (const [key, value] of Object.entries(newOperator)) {
        prevOperator[key] = value;
      }
      Vue.set(state.operators, index, prevOperator);
    },
    SET_USER_HISTORY: (state, userHistory) => {
      state.userHistory = userHistory;
    },
    SET_CURRENT_ROUND: (state, round) => {
      state.currentRound = round;
    },
    SET_ROUNDS: (state, rounds) => {
      state.rounds = rounds;
    },
    SET_ACCOUNTS_DEPOSITED_WITH_POWER: (state, accounts) => {
      state.accountsDepositedWithPower = accounts;
    },
    ADD_ACCOUNT_DEPOSITED_WITH_POWER: (state, account) => {
      if (!state.accountsDepositedWithPower.find(a => a.address === account.address)) {
        state.accountsDepositedWithPower.push(account);
      }
    },
  },
  actions: {
    // considering block time, this timer run and refresh vue state.
    async runTimer (context) {
      while (context.state.signIn) {
        await new Promise(r => setTimeout(r, 5000)); // 5s
        await context.dispatch('set');

        if (context.state.pendingTransactions.length > 0) {
          await context.dispatch('checkPendingTransactions');
        }
      }
    },
    logout (context) {
      context.commit('SET_INITIAL_STATE');
    },
    async signIn (context, web3) {
      context.commit('IS_LOADING', true);
      context.commit('SET_WEB3', web3);

      const user = (await web3.eth.getAccounts())[0];
      const networkId = await web3.eth.net.getId();
      context.commit('SET_USER', user);
      context.commit('SET_NETWORK_ID', networkId);

      const managers = await getManagers();
      const operators = await getOperators();
      const transactions = await getTransactions(user);
      await context.dispatch('setManagers', managers);
      await context.dispatch('setOperatorsWithRegistry', operators);
      await context.dispatch('setTransactions', transactions);

      await context.dispatch('set');
      await context.dispatch('setAccountsDepositedWithPower');

      context.commit('SIGN_IN');
      context.commit('IS_LOADING', false);
      router.replace('/dashboard');
      await context.dispatch('runTimer');
    },
    async set (context) {
      const web3 = this.state.web3;
      const blockNumber = await web3.eth.getBlockNumber();
      context.commit('SET_BLOCK_NUMBER', blockNumber);

      await context.dispatch('setOperators', blockNumber);
      await context.dispatch('setBalance');
      await context.dispatch('setRound');
      await context.dispatch('setHistory');
    },
    async setManagers (context, managers) {
      const user = context.state.user;
      for (const [name, address] of Object.entries(managers)) {
        const abi = managerABIs[`${name}ABI`];
        managers[name] = await createWeb3Contract(abi, address, user);
      }
      context.commit('SET_MANAGERS', managers);
    },
    async setTransactions (context, transactions) {
      const web3 = context.state.web3;

      const mappedTransactions = transactions.map(async pendingTransaction => {
        const minedTransaction = await web3.eth.getTransactionReceipt(pendingTransaction.transactionHash);
        if (minedTransaction) {
          return minedTransaction;
        } else {
          context.commit('ADD_PENDING_TRANSACTION', pendingTransaction);
          return pendingTransaction;
        }
      });
      context.commit('SET_TRANSACTIONS', await Promise.all(mappedTransactions));
    },
    async addTransaction (context, newPendingTransaction) {
      const web3 = context.state.web3;

      const minedTransaction = await web3.eth.getTransactionReceipt(newPendingTransaction.transactionHash);
      if (minedTransaction) {
        context.commit('ADD_TRANSACTION', minedTransaction);
      } else {
        context.commit('ADD_TRANSACTION', newPendingTransaction);
        context.commit('ADD_PENDING_TRANSACTION', newPendingTransaction);
      }
    },
    async checkPendingTransactions (context) {
      const web3 = context.state.web3;
      const pendingTransactions = context.state.pendingTransactions;

      pendingTransactions.forEach(async pendingTransaction => {
        const minedTransaction = await web3.eth.getTransactionReceipt(pendingTransaction.transactionHash);
        if (minedTransaction) {
          context.commit('UPDATE_TRANSACTION_FROM_PENDING_TO_MINED', minedTransaction);
        }
      });
    },
    async updateOperator (context, operator) {
      context.commit('UPDATE_OPERATOR', operator);
    },
    async setOperatorsWithRegistry (context, operators) {
      context.commit('SET_OPERATORS', operators);
    },
    async setOperators (context, blockNumber) {
      const web3 = context.state.web3;
      const user = context.state.user;
      const DepositManager = context.state.DepositManager;
      const SeigManager = context.state.SeigManager;

      const wtonWrapper = (amount) => _WTON.ray(amount);

      const operators = context.state.operators;
      const operatorsFromRootChain = operators.map(async operatorFromRootChain => {
        ///////////////////////////////////////////////////////////////////
        // NOTE: operatorFromRootChain has already have following property.
        //
        // operatorFromRootChain = {
        //   {
        //     "rootchain": "0xc4bf071b54914221cc047f480293231e7df9f85b",
        //     "name": "ONTHER_1",
        //     "website": "https://tokamak.network/",
        //     "description": "Tokamak Network is a platform that assures decentralized and secure property same as Ethereum Main chain while supporting high level of scalability and extendability.",
        //     "avatar": "66652a5c44d1e8aa64a73366ad7f263a",
        //     "color": "rgb(63,220,161)"
        //   },
        // }
        //
        ///////////////////////////////////////////////////////////////////
        const rootchain = operatorFromRootChain.rootchain;
        const RootChain = await createWeb3Contract(RootChainABI, rootchain);
        const Coinage =
          await createWeb3Contract(CustomIncrementCoinageABI, await SeigManager.methods.coinages(rootchain).call());

        const getRecentCommitTimeStamp = async () => {
          const fork = await RootChain.methods.forks(forkNumber).call();
          const epochNumber = fork.lastFinalizedEpoch;
          const blockNumber = fork.lastFinalizedBlock;

          const epoch = await RootChain.methods.getEpoch(forkNumber, epochNumber).call();
          const timestamp
                          = epoch.isRequest ?
                            epoch.NRE.submittedAt :
                            (await RootChain.methods.getBlock(forkNumber, blockNumber).call()).timestamp;
          return timestamp;
        };

        const getDeposit = async (account) => {
          let accStaked, accUnstaked;
          if (typeof account === 'undefined') {
            accStaked = await DepositManager.methods.accStakedRootChain(rootchain).call();
            accUnstaked = await DepositManager.methods.accUnstakedRootChain(rootchain).call();
          } else {
            accStaked = await DepositManager.methods.accStaked(rootchain, account).call();
            accUnstaked = await DepositManager.methods.accUnstaked(rootchain, account).call();
          }
          return accStaked - accUnstaked;
        };

        const getPendingRequests = async () => {
          const numPendingRequests = await DepositManager.methods.numPendingRequests(rootchain, user).call();
          if (numPendingRequests === 0) {
            return [];
          }

          let requestIndex
            = await DepositManager.methods.withdrawalRequestIndex(rootchain, user).call();

          const pendingRequests = [];
          for (const _ of range(numPendingRequests)) {
            const request = await DepositManager.methods.withdrawalRequest(rootchain, user, requestIndex).call();
            pendingRequests.push(request);

            requestIndex++;
          }
          return pendingRequests;
        };

        const filterNotWithdrawableRequests = async (requests) => {
          return requests.filter(request => parseInt(request.withdrawableBlockNumber) > blockNumber);
        };

        const filterWithdrawableRequests = async (requests) => {
          return requests.filter(request => parseInt(request.withdrawableBlockNumber) <= blockNumber);
        };

        const getUserNotWithdrawable = async (notWithdrawableRequests) => {
          const initialAmount = _WTON.ray('0');
          const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));
          return notWithdrawableRequests.reduce(reducer, initialAmount);
        };

        const getUserWithdrawable = async (withdrawableRequests) => {
          const initialAmount = _WTON.ray('0');
          const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));
          return withdrawableRequests.reduce(reducer, initialAmount);
        };

        const operator = await RootChain.methods.operator().call();
        const forkNumber = await RootChain.methods.currentFork().call();

        const recentCommitTimestamp = await getRecentCommitTimeStamp();
        const commitCount = await RootChain.methods.lastEpoch(forkNumber).call();
        const duration = (await web3.eth.getBlock('latest')).timestamp -
                         (await RootChain.methods.getEpoch(0, 0).call()).timestamp;

        // TODO: considering bignumber (check type (number or string?))
        const totalDeposit = await getDeposit();
        const selfDeposit = await getDeposit(operator);
        const userDeposit = await getDeposit(user);

        const totalStaked = await Coinage.methods.totalSupply().call();
        const selfStaked = await Coinage.methods.balanceOf(operator).call();
        const userStaked = await Coinage.methods.balanceOf(user).call();

        const pendingRequests = await getPendingRequests();
        const notWithdrawableRequests = await filterNotWithdrawableRequests(pendingRequests);
        const withdrawableRequests = await filterWithdrawableRequests(pendingRequests);

        const userNotWithdrawable = await getUserNotWithdrawable(notWithdrawableRequests);
        const userWithdrawable = await getUserWithdrawable(withdrawableRequests);

        // set vue state.
        operatorFromRootChain.address = operator;
        operatorFromRootChain.recentCommitTimestamp = recentCommitTimestamp;
        operatorFromRootChain.commitCount = commitCount;
        operatorFromRootChain.duration = duration;
        operatorFromRootChain.totalDeposit = wtonWrapper(totalDeposit);
        operatorFromRootChain.totalStaked = wtonWrapper(totalStaked);
        operatorFromRootChain.selfDeposit = wtonWrapper(selfDeposit);
        operatorFromRootChain.selfStaked = wtonWrapper(selfStaked);

        operatorFromRootChain.userDeposit = wtonWrapper(userDeposit);
        operatorFromRootChain.userStaked = wtonWrapper(userStaked);
        operatorFromRootChain.withdrawableRequests = withdrawableRequests; // used at DepositManager.processRequests count
        // already wrapped with WTON
        operatorFromRootChain.userNotWithdrawable = userNotWithdrawable;
        operatorFromRootChain.userWithdrawable = userWithdrawable;
        operatorFromRootChain.userReward
          = operatorFromRootChain.userStaked
            .add(userNotWithdrawable)
            .add(userWithdrawable)
            .sub(operatorFromRootChain.userDeposit);

        return operatorFromRootChain;
      });

      context.commit('SET_OPERATORS', await Promise.all(operatorsFromRootChain));
    },
    async setBalance (context) {
      const web3 = context.state.web3;
      const user = context.state.user;

      const TON = context.state.TON;
      const WTON = context.state.WTON;
      const PowerTON = context.state.PowerTON;

      const ethBalance = await web3.eth.getBalance(user);
      const tonBalance = await TON.methods.balanceOf(user).call();
      const wtonBalance = await WTON.methods.balanceOf(user).call();
      const power = await PowerTON.methods.powerOf(user).call();

      context.commit('SET_ETH_BALANCE', _ETH.wei(ethBalance.toString()).toString());
      context.commit('SET_TON_BALANCE', _TON.wei(tonBalance.toString()).toString());
      context.commit('SET_WTON_BALANCE', _WTON.ray(wtonBalance.toString()).toString());
      context.commit('SET_POWER', _POWER.ray(power.toString()).toString());
    },
    async setHistory (context) {
      const user = context.state.user;
      const userHistory = await getHistory(user);

      context.commit('SET_USER_HISTORY', userHistory.map(h => h.history));
    },
    async setRound (context) {
      const user = context.state.user;
      const WTON = context.state.WTON;
      const PowerTON = context.state.PowerTON;

      const currentRoundIndex = await PowerTON.methods.currentRound().call();
      const currentRound = await PowerTON.methods.rounds(currentRoundIndex).call();
      currentRound.index = currentRoundIndex;

      const REWARD_NUMERATOR = await PowerTON.methods.REWARD_NUMERATOR().call();
      const REWARD_DENOMINATOR = await PowerTON.methods.REWARD_DENOMINATOR().call();
      const balance = await WTON.methods.balanceOf(PowerTON._address).call();
      const reward = new BN(balance).mul(new BN(REWARD_NUMERATOR)).div(new BN(REWARD_DENOMINATOR));
      currentRound.reward = _WTON.ray(reward);

      const totalDeposits = _POWER.ray(await PowerTON.methods.totalDeposits().call());
      const userPower = _POWER.ray(await PowerTON.methods.powerOf(user).call());

      // `.div` needs to check zero value
      if (!totalDeposits.eq(_POWER.ray('0'))) {
        const winningProbability = userPower.div(totalDeposits);
        currentRound.winningProbability = `${numeral(winningProbability.toNumber()).format('0.00%')}`;
      } else {
        currentRound.winningProbability = '0.00%';
      }
      context.commit('SET_CURRENT_ROUND', currentRound);

      const rounds = [];
      for (const i of range(currentRoundIndex)) {
        const round = await PowerTON.methods.rounds(i).call();
        round.index = i;
        round.reward = _WTON.ray(round.reward);
        rounds.push(round);
      }
      context.commit('SET_ROUNDS', rounds);
    },
    async setAccountsDepositedWithPower (context) {
      const web3 = context.state.web3;
      const PowerTON = context.state.PowerTON;
      const DepositManager = context.state.DepositManager;

      const depositedEvent = web3.eth.abi.encodeEventSignature('Deposited(address,address,uint256)');
      const deployedAt = DepositManager.transactionConfirmationBlocks;

      // event Deposited(address indexed rootchain, address depositor, uint256 amount);
      const events = await DepositManager.getPastEvents('Deposited', {
        fromBlock: deployedAt,
        toBlock: 'latest',
        topics: [depositedEvent],
      });

      const depositors = uniq(events.map(event => event.returnValues.depositor));
      const accounts = depositors.map(async depositor => {
        const power = await PowerTON.methods.powerOf(depositor).call();
        return {
          address: depositor.toLowerCase(),
          power: _POWER.ray(power.toString()),
        };
      });
      context.commit('SET_ACCOUNTS_DEPOSITED_WITH_POWER', await Promise.all(accounts));
    },
    async addAccountDepositedWithPower (context, depositor) {
      const PowerTON = context.state.PowerTON;
      const power = await PowerTON.methods.powerOf(depositor).call();
      context.commit('ADD_ACCOUNT_DEPOSITED_WITH_POWER', {
        address: depositor.toLowerCase(),
        power: _POWER.ray(power.toString()),
      });
    },
  },
  getters: {
    initialState: (state) => {
      return isEqual(state, initialState);
    },
    operatorsStaked: state => {
      if (state.operators && state.operators.length > 0) {
        return state.operators.filter(operator => parseInt(operator.userStaked) > 0);
      }
      else return [];
    },
    operatorByRootChain: (state) => (rootchain) => {
      return state.operators.find(operator => operator.rootchain.toLowerCase() === rootchain.toLowerCase());
    },
    userTotalDeposit: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) => amount.add(operator.userDeposit);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalStaked: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) => amount.add(operator.userStaked);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalNotWithdrawable: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) => amount.add(operator.userNotWithdrawable);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalWithdrawable: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) => amount.add(operator.userWithdrawable);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalReward: (_, getters) => {
      return getters.userTotalStaked
        .add(getters.userTotalWithdrawable)
        .add(getters.userTotalNotWithdrawable)
        .sub(getters.userTotalDeposit);
    },
    rankedAccountsWithPower: (state) => {
      const accounts = state.accountsDepositedWithPower;
      const orderedAccounts = orderBy(accounts, (account) => account.power.toNumber(), ['desc']);

      let rank = 1;
      orderedAccounts.forEach(account => {
        account.rank = rank;
        rank++;
      });
      return orderedAccounts;
    },
    recentTransactions: (state) => {
      const orderedTransactions = orderBy(state.transactions, (transaction) => transaction.blockNumber, ['desc']);
      return orderedTransactions.slice(0, 5);
    },
  },
});
