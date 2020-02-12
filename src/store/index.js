import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import { getState, getHistory } from '@/api';
import _ from 'lodash';

import { createTruffleContract } from '@/helpers/Contract';
import { createCurrency } from '@makerdao/currency';

const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');

import TON from '@/contracts/ABI/TON.json';
import WTON from '@/contracts/ABI/WTON.json';
import DepositManager from '@/contracts/ABI/DepositManager.json';
import RootChainRegistry from '@/contracts/ABI/RootChainRegistry.json';
import SeigManager from '@/contracts/ABI/SeigManager.json';
const managerABIs = {
  TONABI: TON.abi,
  WTONABI: WTON.abi,
  DepositManagerABI: DepositManager.abi,
  RootChainRegistryABI: RootChainRegistry.abi,
  SeigManagerABI: SeigManager.abi,
};

import RootChain from '@/contracts/ABI/RootChain.json';
const RootChainABI = RootChain.abi;

import CustomIncrementCoinage from '@/contracts/ABI/CustomIncrementCoinage.json';
const CustomIncrementCoinageABI = CustomIncrementCoinage.abi;

const initialState = {
  loading: false,

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
};

const getInitialState = () => initialState;

export default new Vuex.Store({
  state: _.cloneDeep(initialState),
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
    ADD_PENDING_TX: (state, request) => {
      state.txsPending.push(request);
    },
    DELETE_PENDING_TX: (state, request) => {
      state.txsPending.splice(state.txsPending.indexOf(request), 1);
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
  },
  actions: {
    addPendingTx (context, request) {
      const txsPending = context.state.txsPending;
      if (!txsPending.find(r => r === request)) context.commit('ADD_PENDING_TX', request);
    },
    deletePendingTx (context, request) {
      context.commit('DELETE_PENDING_TX', request);
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
      context.commit('IS_LOADING', true);

      const user = (await web3.eth.getAccounts())[0];
      // TODO: to change chainId?
      const networkId = (await web3.eth.net.getId());

      context.commit('SET_WEB3', web3);
      context.commit('SET_USER', user);
      context.commit('SET_NETWORK_ID', networkId);
      console.log('connected');

      await context.dispatch('set');

      context.commit('IS_LOADING', false);
    },
    async set (context) {
      return getState()
        .then(async state => {
          const managers = state.managers;
          const rootchains = state.rootchains;

          await context.dispatch('setManagers', managers);
          await context.dispatch('setOperatorFromRootchains', rootchains);
          await context.dispatch('setUserBalanceAndAllowance');
          await context.dispatch('setUserHistory');
          console.log('set');
        });
    },
    async setManagers (context, managers) {
      for (const [name, address] of Object.entries(managers)) {
        const abi = managerABIs[`${name}ABI`];
        managers[name] = await createTruffleContract(abi, address);
      }
      context.commit('SET_MANAGERS', managers);
    },
    async setOperatorFromRootchains (context, rootchains) {
      const web3 = context.state.web3;
      const user = context.state.user;
      const DepositManager = context.state.DepositManager;
      const SeigManager = context.state.SeigManager;

      let count = 0;
      const operatorsFromRootchain = rootchains.map(async rootchain => {
        const RootChain = await createTruffleContract(RootChainABI, rootchain);
        const Coinage =
            await createTruffleContract(CustomIncrementCoinageABI, (await SeigManager.coinages(rootchain)));

        const forkNumber = await RootChain.currentFork();
        const operator = await RootChain.operator();

        const getTotalStake = async () => {
          const totTotalSupplyAtCommit = await SeigManager.totTotalSupplyAtCommit(rootchain);
          const totalCoinageBalance = await Coinage.totalSupply();

          return totTotalSupplyAtCommit.add(totalCoinageBalance);
        };

        const getStake = async (account) => {
          const accStaked = await DepositManager.accStaked(rootchain, account);
          const accUnstaked = await DepositManager.accUnstaked(rootchain, account);
          return accStaked.sub(accUnstaked);
        };

        const getReward = async (account) => {
          const stake = await getStake(account);
          const coinageBalance = await Coinage.balanceOf(account);

          return coinageBalance.sub(stake);
        };

        const getRecentCommitTimeStamp = async () => {
          const fork = await RootChain.forks(forkNumber);
          const epochNumber = fork.lastFinalizedEpoch;
          const blockNumber = fork.lastFinalizedBlock;

          const epoch = await RootChain.getEpoch(forkNumber, epochNumber);
          const timestamp
                          = epoch.isRequest ?
                            epoch.NRE.submittedAt :
                            (await RootChain.getBlock(forkNumber, blockNumber)).timestamp;
          return timestamp;
        };

        const recentCommitTimestamp = await getRecentCommitTimeStamp();
        const commitCount = await RootChain.lastEpoch(forkNumber);
        const duration
          = (await web3.eth.getBlock('latest')).timestamp - (await RootChain.getEpoch(0, 0)).timestamp;

        const totalStake = _WTON.ray((await getTotalStake()).toString());
        const operatorStake = _WTON.ray((await getStake(operator)).toString());
        const userStake = _WTON.ray((await getStake(user)).toString());

        // const totalReward = _WTON.ray((await Coinage.totalSupply()).toString());
        // const operatorStake = _WTON.ray((await getStake(operator)).toString());
        // const userStake = _WTON.ray((await getStake(user)).toString());

        const userReward = _WTON.ray((await getReward(user)).toString());
        const userClaim = _WTON.ray((await SeigManager.stakeOf(rootchain, user)).toString());
        // TODO: fix `Returned values aren't valid, did it run Out of Gas?` error
        // const userUncomittedStakeOf
        //   = _WTON.ray((await SeigManager.uncomittedStakeOf(rootchain, operator)).toString());

        count++;
        return {
          name : `TOKAMAK_OPERATOR_${count}`,
          website : `www.tokamak${count}.network`,
          address: operator,                        // operator address
          rootchain,                                // rootchain address
          recentCommitTimestamp,
          commitCount,
          duration,
          totalStake,
          operatorStake,
          userStake,
          userReward,
          userClaim,
          // userUncomittedStakeOf,
        };
      });

      context.commit('SET_OPERATORS', await Promise.all(operatorsFromRootchain));
    },
    async setUserBalanceAndAllowance (context) {
      const user = context.state.user;

      const TON = context.state.TON;
      const WTON = context.state.WTON;
      const DepositManager = context.state.DepositManager;

      context.commit('SET_TON_BALANCE', _TON.wei((await TON.balanceOf(user)).toString()));
      context.commit('SET_TON_ALLOWANCE', _TON.wei((await TON.allowance(user, DepositManager.address)).toString()));
      context.commit('SET_WTON_BALANCE', _WTON.ray((await WTON.balanceOf(user)).toString()));
      context.commit('SET_WTON_ALLOWANCE',
        _WTON.ray((await WTON.allowance(user, DepositManager.address)).toString()));
    },
    async setUserHistory (context) {
      const user = context.state.user;
      const userHistory = await getHistory(user);

      context.commit('SET_USER_HISTORY', userHistory);
    },
  },
  getters: {
    operatorsStaked: state => {
      if (state.operators && state.operators.length > 0)
        return state.operators.filter(operator => parseInt(operator.userStake) > 0);
      else return [];
    },
    operatorByAddress: (state) => (address) => {
      return state.operators.find(operator => operator.address.toLowerCase() === address);
    },
    isTxProcessing: (state) => (type) => {
      return state.txsPending.includes(type);
    },
  },
});
