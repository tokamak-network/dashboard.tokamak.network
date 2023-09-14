import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import router from '@/router';
import web3EthABI from 'web3-eth-abi';

import { getManagers, getOperators, getHistory, getTransactions, addTransaction } from '@/api';
import { cloneDeep, isEqual, range, uniq, orderBy } from 'lodash';
import numeral from 'numeral';
import { createWeb3Contract } from '@/helpers/Contract';
import { BN } from 'web3-utils';
import { setPendingTransactions, getPendingTransactions } from '@/helpers/localStorage';

import { createCurrency } from '@makerdao/currency';
const _ETH = createCurrency('ETH');
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
const _POWER = createCurrency('POWER');

import TONABI from '@/contracts/abi/TON.json';
import WTONABI from '@/contracts/abi/WTON.json';
import DepositManagerABI from '@/contracts/abi/DepositManager.json';
import RootChainRegistryABI from '@/contracts/abi/RootChainRegistry.json';
import SeigManagerABI from '@/contracts/abi/SeigManager.json';
import PowerTONABI from '@/contracts/abi/PowerTON.json';
import RootChainABI from '@/contracts/abi/RootChain.json';
import CustomIncrementCoinageABI from '@/contracts/abi/CustomIncrementCoinage.json';

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
      if (!state.transactions.find(transaction => transaction.transactionHash === newTransaction.transactionHash)) {
        state.transactions.push(newTransaction);
      }
    },
    SET_PENDING_TRANSACTIONS: (state, pendingTransactions) => {
      state.pendingTransactions = pendingTransactions;
    },
    ADD_PENDING_TRANSACTION: (state, newPendingTransaction) => {
      if (!state.pendingTransactions.find(pendingTransaction => pendingTransaction.transactionHash === newPendingTransaction.transactionHash)) {
        state.pendingTransactions.push(newPendingTransaction);
      }
      setPendingTransactions(state.pendingTransactions);
    },
    DELETE_PENDING_TRANSACTION: (state, minedTransaction) => {
      state.pendingTransactions.splice(state.pendingTransactions.map(pendingTransaction => pendingTransaction.transactionHash).indexOf(minedTransaction.transactionHash), 1);
      setPendingTransactions(state.pendingTransactions);
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
    ADD_ACCOUNT_DEPOSITED_WITH_POWER: (state, accountWithPower) => {
      const findAccount = (account) => account.address.toLowerCase() === accountWithPower.address.toLowerCase();
      const index = state.accountsDepositedWithPower.findIndex(findAccount);

      if (index > -1) {
        Vue.set(state.accountsDepositedWithPower, index, accountWithPower);
      } else {
        state.accountsDepositedWithPower.push(accountWithPower);
      }
    },
  },
  actions: {
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

      await Promise.all([
        context.dispatch('setTransactionsAndPendingTransactions', transactions),
        context.dispatch('setAccountsDepositedWithPower'),
        context.dispatch('set', web3),
      ]);

      context.commit('SIGN_IN');
      context.commit('IS_LOADING', false);
      router.replace({ path: 'dashboard', query: { network: router.app.$route.query.network } }).catch(err => {});
    },
    async set (context, web3) {
      const blockNumber = await web3.eth.getBlockNumber();
      context.commit('SET_BLOCK_NUMBER', blockNumber);

      await Promise.all([
        context.dispatch('setOperators', blockNumber),
        context.dispatch('setBalance'),
        context.dispatch('setCurrentRound'),
        context.dispatch('setRounds'),
        context.dispatch('setHistory'),
        context.dispatch('checkPendingTransactions'),
      ]).catch(err => {
        // after logout, error can be happened
      });
    },
    async setManagers (context, managers) {
      const user = context.state.user;
      const managerABIs = {
        TONABI,
        WTONABI,
        DepositManagerABI,
        RootChainRegistryABI,
        SeigManagerABI,
        PowerTONABI,
      };
      for (const [name, address] of Object.entries(managers)) {
        const abi = managerABIs[`${name}ABI`];
        managers[name] = await createWeb3Contract(abi, address, user);
      }
      context.commit('SET_MANAGERS', managers);
    },
    async setTransactionsAndPendingTransactions (context, transactions) {
      context.commit('SET_TRANSACTIONS', transactions);

      const pendingTransactions = getPendingTransactions();
      context.commit('SET_PENDING_TRANSACTIONS', pendingTransactions);
    },
    async addPendingTransaction (context, transaction) {
      context.commit('ADD_PENDING_TRANSACTION', transaction);
    },
    async deletePendingTransaction (context, transaction) {
      context.commit('DELETE_PENDING_TRANSACTION', transaction);
    },
    async checkPendingTransactions (context) {
      const web3 = context.state.web3;
      const pendingTransactions = context.state.pendingTransactions;

      pendingTransactions.forEach(async transaction => {
        const receipt = await web3.eth.getTransactionReceipt(transaction.transactionHash);
        if (receipt) {
          transaction.receipt = receipt;
          const minedTransaction = await addTransaction(transaction);
          context.commit('ADD_TRANSACTION', minedTransaction);
          context.commit('DELETE_PENDING_TRANSACTION', minedTransaction);

          if (receipt.status) {
            Vue.notify({
              group: 'confirmed',
              title: 'Transaction is confirmed',
              type: 'success',
              duration: 10000,
            });
          } else {
            Vue.notify({
              group: 'reverted',
              title: 'Transaction is reverted',
              type: 'error',
              duration: 10000,
            });
          }
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
      const user = context.state.user;
      const DepositManager = context.state.DepositManager;
      const SeigManager = context.state.SeigManager;

      const wtonWrapper = (amount) => _WTON.ray(amount);

      const operators = context.state.operators;
      const operatorsFromRootChain = await Promise.all(
        operators.map(async operatorFromRootChain => {
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
          //     "color": "rgb(63,220,161)",
          //     "chainId": "1021",
          //   },
          // }
          //
          ///////////////////////////////////////////////////////////////////
          const rootchain = operatorFromRootChain.rootchain;
          const RootChain = await createWeb3Contract(RootChainABI, rootchain);
          const Coinage =
            await createWeb3Contract(CustomIncrementCoinageABI, await SeigManager.methods.coinages(rootchain).call());

          const getLastFinalizedAt = async (lastFinalizedEpochNumber, lastFinalizedBlockNumber) => {
            const epoch = await RootChain.methods.getEpoch(currentForkNumber, lastFinalizedEpochNumber).call();
            const timestamp
                            = epoch.isRequest ?
                              (await RootChain.methods.getBlock(currentForkNumber, lastFinalizedBlockNumber).call()).finalizedAt :
                              epoch.NRE.finalizedAt;
            return timestamp;
          };

          const getDeposit = async (account) => {
            let accStaked, accUnstaked;
            if (typeof account === 'undefined') {
              accStaked = await DepositManager.methods.accStakedRootChain(rootchain).call();
              accUnstaked = await DepositManager.methods.accUnstakedRootChain(rootchain).call();
            } else {
              accStaked = await DepositManager.methods.accStaked(rootchain, account).call(null, blockNumber);
              accUnstaked = await DepositManager.methods.accUnstaked(rootchain, account).call(null, blockNumber);
            }
            const deposit = new BN(accStaked).sub(new BN(accUnstaked));
            if (deposit.cmp(new BN('0')) === -1) {
              return '0';
            } else {
              return deposit.toString();
            }
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

          const filterNotWithdrawableRequests = (requests) => {
            return requests.filter(request => parseInt(request.withdrawableBlockNumber) > blockNumber);
          };

          const filterWithdrawableRequests = (requests) => {
            return requests.filter(request => parseInt(request.withdrawableBlockNumber) <= blockNumber);
          };

          const getUserNotWithdrawable = (notWithdrawableRequests) => {
            const initialAmount = _WTON.ray('0');
            const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));
            return notWithdrawableRequests.reduce(reducer, initialAmount);
          };

          const getUserWithdrawable = (withdrawableRequests) => {
            const initialAmount = _WTON.ray('0');
            const reducer = (amount, request) => amount.add(_WTON.ray(request.amount));
            return withdrawableRequests.reduce(reducer, initialAmount);
          };

          const operator = await RootChain.methods.operator().call();
          const currentForkNumber = await RootChain.methods.currentFork().call();
          const currentFork = await RootChain.methods.forks(currentForkNumber).call();
          const lastFinalizedEpochNumber = currentFork.lastFinalizedEpoch;
          const lastFinalizedBlockNumber = currentFork.lastFinalizedBlock;

          const [
            totalDeposit,
            selfDeposit,
            userDeposit,
            totalStaked,
            selfStaked,
            userStaked,
            pendingRequests,
            lastFinalizedAt,
            firstEpoch,
          ] = await Promise.all([
            getDeposit(),
            getDeposit(operator),
            getDeposit(user),
            Coinage.methods.totalSupply().call(),
            Coinage.methods.balanceOf(operator).call(),
            Coinage.methods.balanceOf(user).call(null, blockNumber),
            getPendingRequests(),
            getLastFinalizedAt(lastFinalizedEpochNumber, lastFinalizedBlockNumber),
            RootChain.methods.getEpoch(0, 0).call(),
          ]);

          const finalizeCount = parseInt(lastFinalizedEpochNumber) + 1;
          const deployedAt = firstEpoch.timestamp;

          const notWithdrawableRequests = filterNotWithdrawableRequests(pendingRequests);
          const withdrawableRequests = filterWithdrawableRequests(pendingRequests);

          const userNotWithdrawable = getUserNotWithdrawable(notWithdrawableRequests);
          const userWithdrawable = getUserWithdrawable(withdrawableRequests);

          // set vue state.
          operatorFromRootChain.address = operator;
          operatorFromRootChain.lastFinalizedAt = lastFinalizedAt;
          operatorFromRootChain.finalizeCount = finalizeCount;
          operatorFromRootChain.deployedAt = deployedAt;
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
        })
      );
      context.commit('SET_OPERATORS', operatorsFromRootChain);
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

      context.commit('SET_ETH_BALANCE', _ETH.wei(ethBalance.toString()));
      context.commit('SET_TON_BALANCE', _TON.wei(tonBalance.toString()));
      context.commit('SET_WTON_BALANCE', _WTON.ray(wtonBalance.toString()));
      context.commit('SET_POWER', _POWER.ray(power.toString()));
    },
    async setHistory (context) {
      const user = context.state.user;
      const userHistory = await getHistory(user);

      context.commit('SET_USER_HISTORY', userHistory.map(h => h.history));
    },
    async setCurrentRound (context) {
      const user = context.state.user;
      const WTON = context.state.WTON;
      const PowerTON = context.state.PowerTON;

      const currentRoundIndex = await PowerTON.methods.currentRound().call();
      const [
        currentRound,
        REWARD_NUMERATOR,
        REWARD_DENOMINATOR,
        balance,
        totalDeposits,
        power,
      ] = await Promise.all([
        PowerTON.methods.rounds(currentRoundIndex).call(),
        PowerTON.methods.REWARD_NUMERATOR().call(),
        PowerTON.methods.REWARD_DENOMINATOR().call(),
        WTON.methods.balanceOf(PowerTON._address).call(),
        PowerTON.methods.totalDeposits().call(),
        PowerTON.methods.powerOf(user).call(),
      ]);
      const userPower = _POWER.ray(power);
      const totalPower = _POWER.ray(totalDeposits);
      const reward = new BN(balance).mul(new BN(REWARD_NUMERATOR)).div(new BN(REWARD_DENOMINATOR));

      currentRound.index = currentRoundIndex;
      currentRound.reward = _WTON.ray(reward);
      // `.div` needs to check zero value
      if (!totalPower.eq(_POWER.ray('0'))) {
        const winningProbability = userPower.div(totalPower);
        currentRound.winningProbability = `${numeral(winningProbability.toNumber()).format('0.00%')}`;
      } else {
        currentRound.winningProbability = '0.00%';
      }
      context.commit('SET_CURRENT_ROUND', currentRound);
    },
    async setRounds (context) {
      const PowerTON = context.state.PowerTON;
      const roundEndEvent = web3EthABI.encodeEventSignature('RoundEnd(uint256,address,uint256)');
      const deployedAt = PowerTON.transactionConfirmationBlocks;

      const events = await PowerTON.getPastEvents('RoundEnd', {
        fromBlock: deployedAt,
        toBlock: 'latest',
        topics: [roundEndEvent],
      });
      const rounds = events.map(event => {
        const returnValues = event.returnValues;
        return {
          index: parseInt(returnValues.round),
          winner: returnValues.winner,
          reward: _POWER.ray(returnValues.reward),
        };
      });
      context.commit('SET_ROUNDS', rounds);
    },
    async setAccountsDepositedWithPower (context) {
      const PowerTON = context.state.PowerTON;
      const DepositManager = context.state.DepositManager;
      const depositedEvent = web3EthABI.encodeEventSignature('Deposited(address,address,uint256)');
      const deployedAt = DepositManager.transactionConfirmationBlocks;

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
