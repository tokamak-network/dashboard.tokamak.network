import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import axios from 'axios';
import _ from 'lodash';

import { createTruffleContract } from '@/helpers/Contract';

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
  modalType: '',
  isModalShowed: false,

  web3: null,
  user: '',
  networkId: '',
  tonBalance: '',
  wtonBalance: '',
  tonAllowance: '',
  wtonAllowance: '',
  historyList: null,

  // managers
  TON: null,
  WTON: null,
  DepositManager: null,
  RootChainRegistry: null,
  SeigManager: null,

  operators: null,
  myStakes: null,
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
    SET_WEB3: (state, web3) => {
      state.web3 = web3;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_NETWORK_ID: (state, networkId) => {
      state.networkId = networkId;
    },
    SHOW_MODAL: (state, isModalShowed) => {
      state.isModalShowed = isModalShowed;
    },
    SET_MODAL_TYPE: (state, type) => {
      state.modalType = type;
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

        console.log(`
        name:     ${name}
        contract: ${contract}
        `);
      }
    },
    SET_OPERATORS: (state, operators) => {
      if (operators) state.operators = operators;
      else state.operators = [];

      operators.map(operator => {
        console.log(`
        operators: ${operator}
        `);
      });
    },
  },
  actions: {
    showModal (context, modalType) {
      context.commit('SET_MODAL_TYPE', modalType);
      context.commit('SHOW_MODAL', true);
    },
    closeModal (context) {
      context.commit('SET_MODAL_TYPE', '');
      context.commit('SHOW_MODAL', false);
    },
    logout (context) {
      context.commit('SET_INITIAL_STATE');
    },
    async connect (context, web3) {
      const user = (await web3.eth.getAccounts())[0];
      const networkId = (await web3.eth.net.getId());

      context.commit('SET_WEB3', web3);
      context.commit('SET_USER', user);
      context.commit('SET_NETWORK_ID', networkId);
    },
    async set (context) {
      return axios.get('http://localhost:9000/')
        .then(async res => {
          const managers = res.data.managers;
          const rootchains = res.data.rootchains;

          console.log(`
          managers  : ${managers}
          rootchains: ${rootchains}
          `);

          for (const [name, address] of Object.entries(managers)) {
            const abi = managerABIs[`${name}ABI`];
            managers[name] = await createTruffleContract(abi, address);

            console.log(`
            name:     ${name}
            address:  ${address}
            abi:      ${abi}
            contract: ${managers[name]}
            `
            );
          }
          context.commit('SET_MANAGERS', managers);

          const user = context.state.user;
          const DepositManager = context.state.DepositManager;
          const SeigManager = context.state.SeigManager;

          const operatorsFromRootchain = rootchains.map(async address => {
            const rootchain = await createTruffleContract(RootChainABI, address);
            const forkNumber = await rootchain.currentFork();
            const operator = await rootchain.operator();
            const coinage =
                await createTruffleContract(CustomIncrementCoinageABI, (await SeigManager.coinages(address)));

            const getTotalStake = async () => {
              const totTotalSupplyAtCommit = await SeigManager.totTotalSupplyAtCommit(address);
              const totalCoinageBalance = await coinage.totalSupply();

              return totTotalSupplyAtCommit.add(totalCoinageBalance);
            };

            const getStake = async (account) => {
              const accStaked = await DepositManager.accStaked(address, account);
              const accUnstaked = await DepositManager.accUnstaked(address, account);
              const stake = accStaked.sub(accUnstaked);

              const coinageBalance = await coinage.balanceOf(account);

              return stake.add(coinageBalance);
            };

            const getRecentCommitTimeStamp = async () => {
              const fork = await rootchain.forks(forkNumber);
              const epochNumber = fork.lastFinalizedEpoch;
              const blockNumber = fork.lastFinalizedBlock;

              const epoch = await rootchain.getEpoch(forkNumber, epochNumber);
              const timestamp
                              = epoch.isRequest ?
                                epoch.NRE.submittedAt :
                                (await rootchain.getBlock(forkNumber, blockNumber)).timestamp;
              return timestamp;
            };

            const totalStake = (await getTotalStake()).toString();
            const operatorStake = (await getStake(operator)).toString();
            const recentCommitTimestamp = await getRecentCommitTimeStamp();
            const commitCount = (await rootchain.lastEpoch(forkNumber)).toString();
            const duration = (await rootchain.getEpoch(0, 0)).timestamp;

            // TODO: @makerdao/currency
            const userStake = (await getStake(user)).toString();
            const userClaim = (await SeigManager.stakeOf(address, user)).toString();

            return {
              rootchain: address,    // rootchain address
              operator,
              totalStake,
              operatorStake,
              recentCommitTimestamp,
              commitCount,
              duration,             // web3.getBlock('latest').timestamp - duration.
              userStake,
              userClaim,
            };
          });
          context.commit('SET_OPERATORS', await Promise.all(operatorsFromRootchain));

          // TODO: use @makerdao/currency
          const TON = context.state.TON;
          context.commit('SET_TON_BALANCE', await TON.balanceOf(user));
          context.commit('SET_TON_ALLOWANCE', await TON.allowance(user, DepositManager.address));

          const WTON = context.state.WTON;
          context.commit('SET_WTON_BALANCE', await WTON.balanceOf(user));
          context.commit('SET_WTON_ALLOWANCE', await WTON.allowance(user, DepositManager.address));
        });
    },
  },
  getters: {
    myStakes: state => {
      return state.operators.filter(operator => parseInt(operator.userStake) > 0);
    },
  },
});
