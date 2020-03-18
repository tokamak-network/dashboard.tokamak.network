import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import router from '@/router';

import { getManagers, getOperators, getHistory } from '@/api';
import { cloneDeep, isEqual, range } from 'lodash';
import { createWeb3Contract } from '@/helpers/Contract';
import { createCurrency } from '@makerdao/currency';
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
const RootChainABI = RootChain.abi;

import CustomIncrementCoinage from '@/contracts/CustomIncrementCoinage.json';
const CustomIncrementCoinageABI = CustomIncrementCoinage.abi;

const initialState = {
  loading: false,
  signIn: false,

  modalData: null,
  isModalShowed: false,
  isTxProcessing: false,
  txsPending: [],

  web3: null,
  user: '',
  networkId: '',
  tonBalance: _TON('0'),
  wtonBalance: _WTON('0'),
  tonAllowance: _TON('0'),
  wtonAllowance: _WTON('0'),
  historyList: null,

  TON: null,
  WTON: null,
  DepositManager: null,
  RootChainRegistry: null,
  SeigManager: null,

  operators: null,
  myStakes: null,
  userHistory: null,
  power: null,
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
    ADD_PENDING_TX: (state, hash) => {
      state.txsPending.push(hash);
    },
    DELETE_PENDING_TX: (state, hash) => {
      state.txsPending.splice(state.txsPending.indexOf(hash), 1);
    },
    SHOW_MODAL: (state, isModalShowed) => {
      state.isModalShowed = isModalShowed;
    },
    SET_MODAL_DATA: (state, data) => {
      state.modalData = data;
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
    SET_TON_BALANCE: (state, balance) => {
      state.tonBalance = balance;
    },
    SET_WTON_BALANCE: (state, balance) => {
      state.wtonBalance = balance;
    },
    SET_TON_ALLOWANCE: (state, allowance) => {
      state.tonAllowance = allowance;
    },
    SET_WTON_ALLOWANCE: (state, allowance) => {
      state.wtonAllowance = allowance;
    },
    SET_MANAGERS: (state, managers) => {
      for (const [name, contract] of Object.entries(managers)) {
        state[name] = contract;
      }
    },
    SET_OPERATORS: (state, operators) => {
      if (operators) state.operators = operators;
      else state.operators = [];
    },
    SET_USER_HISTORY: (state, userHistory) => {
      state.userHistory = userHistory;
    },
    SET_POWER: (state, power) => {
      state.power = power;
    },
  },
  actions: {
    addPendingTx (context, hash) {
      const txsPending = context.state.txsPending;
      if (!txsPending.find(h => h === hash)) context.commit('ADD_PENDING_TX', hash);
    },
    deletePendingTx (context, hash) {
      context.commit('DELETE_PENDING_TX', hash);
    },
    showModal (context, data) {
      context.commit('SET_MODAL_DATA', data);
      context.commit('SHOW_MODAL', true);
    },
    closeModal (context) {
      context.commit('SET_MODAL_DATA', null);
      context.commit('SHOW_MODAL', false);
    },
    logout (context) {
      context.commit('SET_INITIAL_STATE');
    },
    async signIn (context, web3) {
      const user = (await web3.eth.getAccounts())[0];
      const networkId = await web3.eth.net.getId();

      context.commit('IS_LOADING', true);

      context.commit('SET_WEB3', web3);
      context.commit('SET_USER', user);
      context.commit('SET_NETWORK_ID', networkId);

      await context.dispatch('set');

      context.commit('SIGN_IN');
      context.commit('IS_LOADING', false);

      router.replace('/dashboard');
    },
    async set (context) {
      const managers = await getManagers();
      const operators = await getOperators();

      await context.dispatch('setManagers', managers);
      if (operators.length !== 0) await context.dispatch('setOperators', operators);
      await context.dispatch('setUserBalanceAndAllowance');
      await context.dispatch('setUserHistory');
      await context.dispatch('setPower');
    },
    async setManagers (context, managers) {
      const user = context.state.user;
      for (const [name, address] of Object.entries(managers)) {
        const abi = managerABIs[`${name}ABI`];
        managers[name] = await createWeb3Contract(abi, address, user);
      }
      context.commit('SET_MANAGERS', managers);
    },
    async setOperators (context, operators) {
      const web3 = context.state.web3;
      const user = context.state.user;
      const DepositManager = context.state.DepositManager;
      const SeigManager = context.state.SeigManager;

      const wtonWrapper = (amount) => _WTON.ray(amount);

      const operatorsFromRootChain = operators.map(async operatorFromRootChain => {
        const rootchain = operatorFromRootChain.rootchain;
        const RootChain = await createWeb3Contract(RootChainABI, rootchain);
        const Coinage =
          await createWeb3Contract(CustomIncrementCoinageABI, await SeigManager.methods.coinages(rootchain).call());
        // const Tot =
        //     await createWeb3Contract(CustomIncrementCoinageABI, await SeigManager.tot());

        const forkNumber = await RootChain.methods.currentFork().call();
        const operator = await RootChain.methods.operator().call();

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

        const recentCommitTimestamp = await getRecentCommitTimeStamp();
        const commitCount = await RootChain.methods.lastEpoch(forkNumber).call();
        const duration
          = (await web3.eth.getBlock('latest')).timestamp - (await RootChain.methods.getEpoch(0, 0).call()).timestamp;

        const totalDeposit = await getDeposit();
        const operatorDeposit = await getDeposit(operator);
        const userDeposit = await getDeposit(user);

        const userPendingUnstaked = await DepositManager.methods.pendingUnstaked(rootchain, user).call();
        // TODO: fix
        let userUncomittedStakeOf;
        try {
          userUncomittedStakeOf = await SeigManager.methods.uncomittedStakeOf(rootchain, operator).call();
        } catch (e) {
          userUncomittedStakeOf = '0';
        }

        const totalStake = await Coinage.methods.totalSupply().call();
        const operatorStake = await Coinage.methods.balanceOf(operator).call();
        const userStake = await Coinage.methods.balanceOf(user).call();

        let withdrawalRequestIndex, withdrawalRequest, numRequests, numPendingRequests;
        try {
          withdrawalRequestIndex = await DepositManager.methods.withdrawalRequestIndex(rootchain, user).call();
          withdrawalRequest =
            await DepositManager.methods.withdrawalRequest(rootchain, user, withdrawalRequestIndex).call();
          numRequests = await DepositManager.methods.numRequests(rootchain, user).call();
          numPendingRequests = await DepositManager.methods.numPendingRequests(rootchain, user).call();
        } catch (e) {
          withdrawalRequestIndex = undefined;
          numRequests = undefined;
          numPendingRequests = undefined;
        }

        const pendingRequests = await context.dispatch('getPendingRequests', rootchain);

        operatorFromRootChain.address = operator;
        operatorFromRootChain.recentCommitTimestamp = recentCommitTimestamp;
        operatorFromRootChain.commitCount = commitCount;
        operatorFromRootChain.duration = duration;
        operatorFromRootChain.totalDeposit = wtonWrapper(totalDeposit);
        operatorFromRootChain.operatorDeposit = wtonWrapper(operatorDeposit);
        operatorFromRootChain.userDeposit = wtonWrapper(userDeposit);
        operatorFromRootChain.totalStake = wtonWrapper(totalStake);
        operatorFromRootChain.operatorStake = wtonWrapper(operatorStake);
        operatorFromRootChain.userStake = wtonWrapper(userStake);
        operatorFromRootChain.userPendingUnstaked = wtonWrapper(userPendingUnstaked);
        operatorFromRootChain.userUncomittedStakeOf = wtonWrapper(userUncomittedStakeOf);
        operatorFromRootChain.pendingRequests = pendingRequests;

        return operatorFromRootChain;
      });

      context.commit('SET_OPERATORS', await Promise.all(operatorsFromRootChain));
    },
    async setUserBalanceAndAllowance (context) {
      const user = context.state.user;

      const TON = context.state.TON;
      const WTON = context.state.WTON;
      const DepositManager = context.state.DepositManager;

      const tonBalance = await TON.methods.balanceOf(user).call();
      const wtonBalance = await WTON.methods.balanceOf(user).call();
      const tonAllowance = await TON.methods.allowance(user, WTON._address).call();
      const wtonAllowance = await WTON.methods.allowance(user, DepositManager._address).call();

      context.commit('SET_TON_BALANCE', _TON.wei(tonBalance.toString()).toString());
      context.commit('SET_WTON_BALANCE', _WTON.ray(wtonBalance.toString()).toString());
      context.commit('SET_TON_ALLOWANCE', _TON.wei(tonAllowance.toString()).toString());
      context.commit('SET_WTON_ALLOWANCE', _WTON.ray(wtonAllowance.toString()).toString());
    },
    async setUserHistory (context) {
      const user = context.state.user;
      const userHistory = await getHistory(user);

      context.commit('SET_USER_HISTORY', userHistory.map(h => h.history));
    },
    async getPendingRequests (context, rootchain) {
      const user = context.state.user;
      const DepositManager = context.state.DepositManager;

      let withdrawalRequestIndex, withdrawalRequest, numRequests, numPendingRequests;
      try {
        withdrawalRequestIndex
          = await DepositManager.methods.withdrawalRequestIndex(rootchain, user).call();
        withdrawalRequest
          = await DepositManager.methods.withdrawalRequest(rootchain, user, withdrawalRequestIndex).call();
        numRequests = await DepositManager.methods.numRequests(rootchain, user).call();
        numPendingRequests = await DepositManager.methods.numPendingRequests(rootchain, user).call();
      } catch (e) {
        withdrawalRequestIndex = undefined;
        numRequests = undefined;
        numPendingRequests = undefined;
        return [];
      }

      const requestsPending = [];
      for (const _ of range(numPendingRequests)) {
        const request = await DepositManager.methods.withdrawalRequest(rootchain, user, withdrawalRequestIndex).call();
        requestsPending.push({
          withdrawableBlockNumber: request.withdrawableBlockNumber,
          amount: _WTON.ray(request.amount),
          processed: request.processed,
        });
        withdrawalRequestIndex++;
      }
      return requestsPending;
    },
    async setPower (context) {
      const PowerTON = context.state.PowerTON;
      const currentRound = await PowerTON.methods.currentRound().call();
      const totalDeposits = await PowerTON.methods.totalDeposits().call();

      const rounds = [];
      for (const i of range(currentRound)) {
        const round = await PowerTON.methods.rounds(i).call();
        round.round = i;
        rounds.push(round);
      }

      const user = context.state.user;
      const power = await PowerTON.methods.powerOf(user).call();

      const obj = {
        currentRound: await PowerTON.methods.rounds(currentRound).call(),
        rounds: rounds,
        power: _POWER.ray(power.toString()),
        totalDeposits: _POWER.ray(totalDeposits.toString()),
      };
      obj.currentRound.currentRound = currentRound;

      context.commit('SET_POWER', obj);
    },
  },
  getters: {
    initialState: (state) => {
      return isEqual(state, initialState);
    },
    operatorsStaked: state => {
      if (state.operators && state.operators.length > 0)
        return state.operators.filter(operator => parseInt(operator.userStake) > 0);
      else return [];
    },
    operatorByRootchain: (state) => (rootchain) => {
      return state.operators.find(operator => operator.rootchain.toLowerCase() === rootchain.toLowerCase());
    },
    isTxProcessing: (state) => (type) => {
      return state.txsPending.includes(type);
    },
    userUndepositedBalance: (state) => {
      const balance = state.tonBalance.toNumber() + state.wtonBalance.toNumber();
      return _TON(balance);
    },
    userTotalDeposit: (state) => {
      const initialValue = _WTON.ray('0');
      const reducer = (totalDeposit, operator) => totalDeposit.add(operator.userDeposit);

      return state.operators.reduce(reducer, initialValue);
    },
    userTotalStake: (state) => {
      const initialValue = _WTON.ray('0');
      const reducer = (totalStake, operator) => totalStake.add(operator.userStake);

      return state.operators.reduce(reducer, initialValue);
    },
    userTotalPendingByOperator: (_, getters) => (rootchain) => {
      const operator = getters.operatorByRootchain(rootchain);

      const initialValue = _WTON.ray('0');
      const reducer = (pending, request) => pending.add(request.amount);

      return operator.pendingRequests.reduce(reducer, initialValue);
    },
    userTotalPending: (state, getters) => {
      const initialValue = _WTON.ray('0');
      const reducer = (totalPending, operator) => {
        const pending = getters.userTotalPendingByOperator(operator.rootchain);
        return totalPending.add(pending);
      };

      return state.operators.reduce(reducer, initialValue);
    },
    userTotalReward: (_, getters) => {
      return getters.userTotalStake.add(getters.userTotalPending).sub(getters.userTotalDeposit);
    },
  },
});
