import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import router from '@/router';
import web3EthABI from 'web3-eth-abi';

import {
  getManagers,
  getOperators,
  getOperatorUserHistory,
  getHistory,
  getTransactions,
  addTransaction,
  getDailyStakedTotal,
  getTotalSupply,
  getCandidates,
  getCandidateCreateEvent,
  getDelegators,
  getCommitHistory,
  getRoundReward,
  getPowerTONInfo,
  getRankList,
  getWinnerList,
  getOperatorsInfo,
} from '@/api';
import { cloneDeep, isEqual, range, uniq, orderBy } from 'lodash';
import numeral from 'numeral';
import { createWeb3Contract } from '@/helpers/Contract';
import { BN, toBN } from 'web3-utils';
import {
  setPendingTransactions,
  getPendingTransactions,
} from '@/helpers/localStorage';
import { createCurrency } from '@makerdao/currency';
import { calculateExpectedSeig } from 'tokamak-staking-lib';

const _ETH = createCurrency('ETH');
const _TON = createCurrency('TON');
const _WTON = createCurrency('WTON');
const _POWER = createCurrency('POWER');
const TON_UNIT = 'wei';
const WTON_UNIT = 'ray';

import TONABI from '@/contracts/abi/TON.json';
import WTONABI from '@/contracts/abi/WTON.json';
import DepositManagerABI from '@/contracts/abi/DepositManager.json';
import Layer2RegistryABI from '@/contracts/abi/Layer2Registry.json';
import SeigManagerABI from '@/contracts/abi/SeigManager.json';
import PowerTONABI from '@/contracts/abi/PowerTON.json';
import Layer2ABI from '@/contracts/abi/Layer2.json';
import AutoRefactorCoinageABI from '@/contracts/abi/AutoRefactorCoinage.json';
import axios from 'axios';

import CommitteeABI from '@/contracts/abi/DAOCommittee.json';
const initialState = {
  loading: false,
  loadingAccount: false,
  loaded: false,
  signIn: false,

  // transactionss (based on receipt: getTransactionReceipt)
  transactions: [],
  pendingTransactions: [],

  web3: {},
  user: '',
  networkId: '',
  blockNumber: 0,
  blockTimestamp: 0,
  totalStaked: 0,
  // contract of managers
  TON: {},
  WTON: {},
  DepositManager: {},
  Layer2Registry: {},
  SeigManager: {},
  PowerTON: {},
  pendingTx: '',
  CommitteeProxy: {},
  // balance
  ethBalance: _ETH('0'),
  tonBalance: _TON('0'),
  wtonBalance: _WTON('0'),
  power: _POWER('0'),

  // operator
  operators: [],

  //candidates
  candidates: [],
  // round
  currentRound: {},
  rounds: [],
  currentPowerRound: {},
  // user transaction history
  history: [],
  dailyTotalStaked: [],

  // rank
  accountsDepositedWithPower: [],

  // not yet committed
  uncommittedCurrentRoundReward: _WTON('0'),
  selectedOperator: '',
  powerReward: [],
  totalWithdraw: _TON('0'),
  rankList: [],
  winnerList: [],
  operatorsBeforeConnect: [],
};

const getInitialState = () => initialState;

export default new Vuex.Store({
  state: cloneDeep(initialState),
  mutations: {
    SET_INITIAL_STATE: (state) => {
      const initialState = getInitialState();
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
    IS_LOADING: (state, isLoading) => {
      state.loading = isLoading;
    },
    IS_LOADING_ACCOUNT: (state, isLoading) => {
      state.loadingAccount = isLoading;
    },
    IS_LOADED: (state, loaded) => {
      state.loaded = loaded;
    },
    SIGN_IN: (state, status) => {
      state.signIn = status;
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

    SET_PENDING_TX (state, pendingTx) {
      state.pendingTx = pendingTx;
    },
    SET_BLOCK_TIMESTAMP: (state, timestamp) => {
      state.blockTimestamp = timestamp;
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
    SET_COMMITTEE_PROXY: (state, committeeProxyContract) => {
      state.CommitteeProxy = committeeProxyContract;
    },
    SET_OPERATORS: (state, operators) => {
      state.operators = operators;
    },
    SET_CANDIDATES: (state, candidates) => {
      state.candidates = candidates;
    },
    SET_TRANSACTIONS: (state, transactions) => {
      state.transactions = transactions;
    },
    ADD_TRANSACTION: (state, newTransaction) => {
      if (
        !state.transactions.find(
          (transaction) =>
            transaction.transactionHash === newTransaction.transactionHash
        )
      ) {
        state.transactions.push(newTransaction);
      }
    },
    SET_PENDING_TRANSACTIONS: (state, pendingTransactions) => {
      state.pendingTransactions = pendingTransactions;
    },
    ADD_PENDING_TRANSACTION: (state, newPendingTransaction) => {
      if (
        !state.pendingTransactions.find(
          (pendingTransaction) =>
            pendingTransaction.transactionHash ===
            newPendingTransaction.transactionHash
        )
      ) {
        state.pendingTransactions.push(newPendingTransaction);
      }
      setPendingTransactions(state.pendingTransactions);
    },
    DELETE_PENDING_TRANSACTION: (state, minedTransaction) => {
      state.pendingTransactions.splice(
        state.pendingTransactions
          .map((pendingTransaction) => pendingTransaction.transactionHash)
          .indexOf(minedTransaction.transactionHash),
        1
      );
      setPendingTransactions(state.pendingTransactions);
    },
    UPDATE_OPERATOR: (state, newOperator) => {
      const index = state.operators.indexOf(prevOperator);
      const prevOperator = state.operators.find(
        (operator) => operator.layer2 === newOperator.layer2
      );
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
      const findAccount = (account) =>
        account.address.toLowerCase() ===
        accountWithPower.address.toLowerCase();
      const index = state.accountsDepositedWithPower.findIndex(findAccount);

      if (index > -1) {
        Vue.set(state.accountsDepositedWithPower, index, accountWithPower);
      } else {
        state.accountsDepositedWithPower.push(accountWithPower);
      }
    },
    SET_UNCOMMITTED_CURRENT_ROUND_REWARD: (state, reward) => {
      state.uncommittedCurrentRoundReward = reward;
    },
    SET_TOTALSTAKED: (state, totalStaked) => {
      state.totalStaked = totalStaked;
    },
    SET_DAILY_STAKED_TOTAL: (state, dailyTotalStaked) => {
      state.dailyTotalStaked = dailyTotalStaked;
    },
    SET_SELECTED_OPERATOR: (state, selected) => {
      state.selectedOperator = selected;
    },
    SET_POWER_REWARD: (state, powerReward) => {
      state.powerReward = powerReward;
    },
    SET_TOTAL_WITHDRAW: (state, withdraw) => {
      state.totalWithdraw = withdraw;
    },
    SET_CURRENT_POWER_ROUND: (state, round) => {
      state.currentPowerRound = round;
    },
    SET_RANK_LIST: (state, rankList) => {
      state.rankList = rankList;
    },
    SET_WINNER_LIST: (state, winnerList) => {
      state.winnerList = winnerList;
    },
    SET_OPERATORS_BEFORE_CONNECT: (state, operatorsBeforeConnect) => {
      state.operatorsBeforeConnect = operatorsBeforeConnect;
    },
  },
  actions: {
    getActualAmount (amount) {
      const spliedTonAmount = amount.split('.');
      const beforeDecimalNumber = spliedTonAmount[0];
      const afterDecimalNumber = spliedTonAmount[1].slice(0, 2);
      return `${beforeDecimalNumber}.${afterDecimalNumber}`;
    },
    logout (context) {
      context.commit('SIGN_IN', false);
      context.commit('SET_USER', '');
      context.dispatch('setSelectedOperator', '');
    },
    async load (context) {
      context.commit('IS_LOADING', true);
      const operators = await getOperators();
      const operatorsInfo = await getOperatorsInfo();
      operators.map(operator => {
        operatorsInfo.map(info => {
          if (operator.layer2.toLowerCase() === info.layer2.toLowerCase()) {
            if (info.candidateContract !== info.layer2) {
              operator.isOperator = true;
            }
          }
        });
      });

      await Promise.all([
        context.dispatch('getTotalStaked'),
        context.dispatch('getPowerRoundInfo'),
        context.dispatch('getDailyStakedTokenStats'),
        context.dispatch('getPowerReward'),
        context.dispatch('getRanks'),
        context.dispatch('getWinners'),
        context.dispatch('setOperatorsBeforeConnect', operators),
      ]);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // https://github.com/Onther-Tech/dashboard.tokamak.network/issues/81
      context.commit('IS_LOADING', false);
      context.commit('IS_LOADED', true);
      router
        .replace({
          path: 'home',
          query: { network: router.app.$route.query.network },
        })
        .catch((err) => {});
    },
    // async watchChainIDChange () {
    //   window.ethereum.on('chainIdChanged', (chainId) => {
    //     window.location.reload();
    //   });
    // },
    // async watchAccountChange () {
    //   window.ethereum.on('accountsChanged', (account) => {
    //     console.log(account);
    //   // context.commit('SET_NETWORK_ID', networkId);
    //   });
    // },
    async signIn (context, web3) {
      context.commit('IS_LOADING_ACCOUNT', true);
      context.commit('SET_WEB3', web3);
      const user = (await web3.eth.getAccounts())[0];
      const networkId = await web3.eth.net.getId();
      context.commit('SET_NETWORK_ID', networkId);
      context.commit('SET_USER', user);

      const managers = await getManagers();
      const operators = await getOperators();
      const candidates = await getCandidates();
      const transactions = await getTransactions(user);
      context.dispatch('setCommitteeProxy');
      await context.dispatch('setManagers', managers);
      await context.dispatch('setOperatorsWithRegistry', operators);

      await Promise.all([
        context.dispatch('setCandidates', candidates),
        context.dispatch('setTransactionsAndPendingTransactions', transactions),
        context.dispatch('setAccountsDepositedWithPower'),
        context.dispatch('set', web3),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // https://github.com/Onther-Tech/dashboard.tokamak.network/issues/81
      context.commit('SIGN_IN', true);
      context.commit('IS_LOADING_ACCOUNT', false);
      // context.commit('IS_LOADING', false);
      // router.replace({ path: 'dashboard', query: { network: router.app.$route.query.network } }).catch(err => {});
    },
    async getAllOperators (context) {
      const operators = await getOperators();
      context.dispatch('setOperatorsWithRegistry', operators);
    },
    async set (context, web3) {
      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      context.commit('SET_BLOCK_NUMBER', blockNumber);
      context.commit('SET_BLOCK_TIMESTAMP', block.timestamp);

      await Promise.all([
        context.dispatch('setOperators', blockNumber),
        context.dispatch('setBalance'),
        context.dispatch('setCurrentRound'),
        context.dispatch('setRounds'),
        context.dispatch('setHistory'),
        // context.dispatch('setUncommittedCurrentRoundReward', blockNumber),
        context.dispatch('checkPendingTransactions'),
        context.dispatch('getTotalStaked'),
        context.dispatch('getDailyStakedTokenStats'),
        context.dispatch('getPowerReward'),
        context.dispatch('getWithdraw'),
      ]).catch((err) => {
        // after logout, error can be happened
      });
    },
    async getPowerRoundInfo (context) {
      const rounds = await getPowerTONInfo();
      const currentRound = rounds[0];
      context.commit('SET_CURRENT_POWER_ROUND', currentRound);
    },
    async setOperatorsBeforeConnect (context, operators) {
      const opInfo = await getOperatorsInfo();
      const candidates = await getCandidates();
      operators.forEach(async (operator) => {
        const isCandidate = candidates.find(
          (candidate) => candidate.layer2 === operator.layer2.toLowerCase()
        );
        if (isCandidate.kind === '') {
          operator.isCandidate = false;
        } else {
          operator.isCandidate = true;
        }
        const oper = opInfo.find(
          (op) => op.layer2 === operator.layer2.toLowerCase()
        );
        operator.totalStaked = _TON.ray(oper.updateCoinageTotalString);
        operator.commissionRate = _WTON(
          oper.commissionRate ? oper.commissionRate : 0, WTON_UNIT);
        operator.isCommissionRateNegative = oper.isCommissionRateNegative
          ? oper.isCommissionRateNegative
          : false;
        const operatorsHistory = await getOperatorUserHistory(
          1,
          operator.layer2.toLowerCase()
        );
        operator.operatorsHistory = operatorsHistory;
        const operatorDelegators = await getDelegators(
          1,
          operator.layer2.toLowerCase()
        );
        operator.delegators = operatorDelegators;
        const operatorCommitHistory = await getCommitHistory(
          1,
          operator.layer2.toLowerCase()
        );
        operator.commitHistory = operatorCommitHistory;
        operator.lastFinalizedAt = operatorCommitHistory.length !== 0? operatorCommitHistory[0].blockTimestamp : '0';
        operator.finalizeCount = operatorCommitHistory.length !== 0? (operatorCommitHistory.length).toString() : '0';
      });

      context.commit('SET_OPERATORS_BEFORE_CONNECT', operators);
    },
    setCommitteeProxy (context) {
      const committeeProxy = '0xDD9f0cCc044B0781289Ee318e5971b0139602C26';
      const user = context.state.user;
      const contract = createWeb3Contract(CommitteeABI, committeeProxy, user); // use `Committee` contract abi and `CommitteeProxy` address.
      context.commit('SET_COMMITTEE_PROXY', contract);
    },
    async setManagers (context, managers) {
      const user = context.state.user;
      const managerABIs = {
        TONABI,
        WTONABI,
        DepositManagerABI,
        Layer2RegistryABI,
        SeigManagerABI,
        PowerTONABI,
      };
      for (const [name, address] of Object.entries(managers)) {
        const abi = managerABIs[`${name}ABI`];
        managers[name] = createWeb3Contract(abi, address, user);
      }
      context.commit('SET_MANAGERS', managers);
    },
    async setTransactionsAndPendingTransactions (context, transactions) {
      const web3 = context.state.web3;
      transactions.forEach(async (transaction) => {
        const block = await web3.eth.getBlock(transaction.blockNumber);
        const timestamp = block.timestamp;
        transaction.timestamp = timestamp;
      });
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
    async setUncommittedCurrentRoundReward (context, blockNumber) {
      const TON = context.state.TON;
      const WTON = context.state.WTON;
      const SeigManager = context.state.SeigManager;
      const DepositManager = context.state.DepositManager;

      const [
        seigPerBlock,
        paused,
        lastSeigBlock,
        unpausedBlock,
        pausedBlock,
        tonBalanceOfDepositManager,
        wtonBalanceOfDepositManager,
        tonTotalSupply,
      ] = await Promise.all([
        SeigManager.methods.seigPerBlock().call(),
        SeigManager.methods.paused().call(),
        SeigManager.methods.lastSeigBlock().call(),
        SeigManager.methods.unpausedBlock().call(),
        SeigManager.methods.pausedBlock().call(),
        TON.methods.balanceOf(DepositManager._address).call(),
        WTON.methods.balanceOf(DepositManager._address).call(),
        TON.methods.totalSupply().call(),
      ]);

      function calcNumSeigBlocks () {
        if (paused) return 0;

        const span = blockNumber - lastSeigBlock + 1; // + 1 for new block

        if (unpausedBlock < lastSeigBlock) {
          return span;
        }
        return span - (unpausedBlock - pausedBlock);
      }

      function getUnstakedRate () {
        return _WTON(
          _TON(tonBalanceOfDepositManager, TON_UNIT)
            .toBigNumber()
            .toFixed(),
          WTON_UNIT
        )
          .add(_WTON(wtonBalanceOfDepositManager, WTON_UNIT))
          .div(
            _WTON(
              _TON(tonTotalSupply, TON_UNIT)
                .toBigNumber()
                .toFixed()
            ),
            WTON_UNIT
          );
      }

      const numBlocks = calcNumSeigBlocks();
      const unstakedRate = getUnstakedRate();
      const uncommittedCurrentRoundReward = unstakedRate
        .times(numBlocks)
        .times(_WTON(seigPerBlock, WTON_UNIT))
        .times(0.8)
        .times(0.5);
      context.commit(
        'SET_UNCOMMITTED_CURRENT_ROUND_REWARD',
        uncommittedCurrentRoundReward
      );
    },

    async getDailyStakedTokenStats (context) {
      const dailyStakedTotal = await getDailyStakedTotal(1);
      const totalSup = await getTotalSupply();
      dailyStakedTotal.forEach((item) => {
        const totalStaked = parseFloat(item.totalSupply) / Math.pow(10, 27);
        let my = Number(1000);
        let stakedRatio = 0;
        const unit = 365;
        const maxCompensate = Number('26027.39726');
        const total = Number(totalStaked) + my;
        stakedRatio = total / totalSup;
        const compensatePerDay = stakedRatio * 26027.39726;
        const dailyNotMintedSeig =
          maxCompensate - maxCompensate * (total / totalSup);
        const proportionalSeig = dailyNotMintedSeig * (40 / 100);
        const expectedSeig =
          (my / total) * (Number(compensatePerDay) + proportionalSeig) * unit;
        my = my + expectedSeig;
        // item.roi = (my/Number(1000)*100 - 100)/100;
        item.roi = (((my / Number(1000)) * 100 - 100) / 100).toLocaleString(
          undefined,
          {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }
        );
      });
      context.commit('SET_DAILY_STAKED_TOTAL', dailyStakedTotal);
    },

    async getTotalStaked (context) {
      await axios
        .get('https://price-api.tokamak.network/staking/current')
        .then((response) => {
          context.commit('SET_TOTALSTAKED', response.data);
        });
    },
    async getRanks (context) {
      const rankList = await getRankList();
      let rank = 1;
      rankList.forEach((account) => {
        account.rank = rank;
        account.power = _POWER.ray(account.powerBalance.toString());
        rank++;
      });
      context.commit('SET_RANK_LIST', rankList);
    },
    async getWinners (context) {
      const winnerList = await getWinnerList();
      winnerList.forEach((account) => {
        account.winnerReward = _TON.ray(account.data.reward.toString());
      });
      context.commit('SET_WINNER_LIST', winnerList);
    },
    async checkPendingTransactions (context) {
      const web3 = context.state.web3;
      const pendingTransactions = context.state.pendingTransactions;
      pendingTransactions.forEach(async (transaction) => {
        const receipt = await web3.eth.getTransactionReceipt(
          transaction.transactionHash
        );
        if (receipt) {
          transaction.receipt = receipt;
          const minedTransaction = await addTransaction(transaction);
          const transax = minedTransaction;
          transax.timestamp = transaction.timestamp;
          context.commit('ADD_TRANSACTION', transax);
          context.commit('DELETE_PENDING_TRANSACTION', transax);

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
    async setCandidates (context, candidates) {
      context.commit('SET_CANDIDATES', candidates);
    },
    async setOperators (context, blockNumber) {
      const user = context.state.user;

      const TON = context.state.TON;
      const WTON = context.state.WTON;
      // const web3 = context.state.web3;
      const DepositManager = context.state.DepositManager;
      const SeigManager = context.state.SeigManager;
      const l2Registry = context.state.Layer2Registry;
      const Tot = createWeb3Contract(
        AutoRefactorCoinageABI,
        await SeigManager.methods.tot().call()
      );

      const [
        tonTotalSupply,
        totTotalSupply,
        tonBalanceOfWTON,
      ] = await Promise.all([
        TON.methods.totalSupply().call(),
        Tot.methods.totalSupply().call(),
        TON.methods.balanceOf(WTON._address).call(),
      ]);

      const operators = context.state.operators;
      const candidates = await getCandidates();
      const events = await getCandidateCreateEvent();
      const candidateContractCreated = events.filter(
        (event) => event.eventName === 'CandidateContractCreated'
      );

      for (let i = 0; i < operators.length; i++) {
        if (!(await l2Registry.methods.layer2s(operators[i].layer2).call())) {
          operators.splice(i, 1);
        }
      }
      const operatorsFromLayer2 = await Promise.all(
        operators.map(async (operatorFromLayer2) => {
          ///////////////////////////////////////////////////////////////////
          // NOTE: operatorFromLayer2 has already have following property.
          //
          // operatorFromLayer2 = {
          //   {
          //     "layer2": "0xc4bf071b54914221cc047f480293231e7df9f85b",
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
          const layer2 = operatorFromLayer2.layer2;
          const Layer2 = createWeb3Contract(Layer2ABI, layer2);
          const Coinage = createWeb3Contract(
            AutoRefactorCoinageABI,
            await SeigManager.methods.coinages(layer2).call()
          );
          const [operator, currentForkNumber] = await Promise.all([
            Layer2.methods.operator().call(),
            Layer2.methods.currentFork().call(),
          ]);

          const getRecentCommit = async (operator, layer2) => {
            const web3 = context.state.web3;
            const commitTransactions = [];
            const blockNumbers = [];
            const transactions = await getTransactions(operator);
            for (const transaction of transactions) {
              if (
                transaction.type === 'Commit' &&
                transaction.target === layer2
              ) {
                commitTransactions.push(transaction);
                blockNumbers.push(transaction.blockNumber);
              }
            }
            if (blockNumbers.length === 0) {
              return ['0', '1'];
            } else {
              // const blockNumber = Math.max.apply(null, blockNumbers);
              const blockNumber = await SeigManager.methods
                .lastCommitBlock(layer2)
                .call();
              const block = await web3.eth.getBlock(blockNumber);
              return [String(block.timestamp), String(blockNumbers.length + 1)];
            }
          };

          const getLastFinalizedAt = async (
            lastFinalizedEpochNumber,
            lastFinalizedBlockNumber
          ) => {
            const epoch = await Layer2.methods
              .getEpoch(currentForkNumber, lastFinalizedEpochNumber)
              .call();
            const timestamp = epoch.isRequest
              ? (
                await Layer2.methods
                  .getBlock(currentForkNumber, lastFinalizedBlockNumber)
                  .call()
              ).finalizedAt
              : epoch.NRE.finalizedAt;
            return timestamp;
          };

          const getDeposit = async (account) => {
            let accStaked, accUnstaked;
            if (typeof account === 'undefined') {
              accStaked = await DepositManager.methods
                .accStakedLayer2(layer2)
                .call();
              accUnstaked = await DepositManager.methods
                .accUnstakedLayer2(layer2)
                .call();
            } else {
              accStaked = await DepositManager.methods
                .accStaked(layer2, account)
                .call(null, blockNumber);
              accUnstaked = await DepositManager.methods
                .accUnstaked(layer2, account)
                .call(null, blockNumber);
            }
            const deposit = new BN(accStaked).sub(new BN(accUnstaked));
            if (deposit.cmp(new BN('0')) === -1) {
              // https://github.com/Onther-Tech/plasma-evm-contracts/issues/39
              return '0';
            } else {
              return deposit.toString();
            }
          };
          const getPendingRequests = async () => {
            const numPendingRequests = await DepositManager.methods
              .numPendingRequests(layer2, user)
              .call();
            if (numPendingRequests === 0) {
              return [];
            }

            let requestIndex = await DepositManager.methods
              .withdrawalRequestIndex(layer2, user)
              .call();

            const pendingRequests = [];
            for (const _ of range(numPendingRequests)) {
              pendingRequests.push(
                DepositManager.methods
                  .withdrawalRequest(layer2, user, requestIndex)
                  .call()
              );
              requestIndex++;
            }
            return Promise.all(pendingRequests);
          };
          const isCandidateOperator = () => {
            const candidates = context.state.candidates;
            const isCandidate = candidates.find(
              (candidate) => candidate.layer2 === layer2.toLowerCase()
            );
            if (isCandidate.kind === '') {
              return false;
            } else {
              return true;
            }
          };
          const filterNotWithdrawableRequests = (requests) => {
            return requests.filter(
              (request) =>
                parseInt(request.withdrawableBlockNumber) > blockNumber
            );
          };

          const filterWithdrawableRequests = (requests) => {
            return requests.filter(
              (request) =>
                parseInt(request.withdrawableBlockNumber) <= blockNumber
            );
          };

          const getUserNotWithdrawable = (notWithdrawableRequests) => {
            const initialAmount = _WTON.ray('0');
            const reducer = (amount, request) =>
              amount.add(_WTON.ray(request.amount));
            return notWithdrawableRequests.reduce(reducer, initialAmount);
          };

          const getUserWithdrawable = (withdrawableRequests) => {
            const initialAmount = _WTON.ray('0');
            const reducer = (amount, request) =>
              amount.add(_WTON.ray(request.amount));
            return withdrawableRequests.reduce(reducer, initialAmount);
          };

          // const userHistoryForOperator = async () => {
          //   const networkID = context.state.networkId;
          //   const operatorsHistory = await getOperatorUserHistory(networkID, layer2);
          //   return operatorsHistory;
          // };
          const getExpectedSeigs = async () => {
            const [
              isCommissionRateNegative,
              paused,
              lastSeigBlock,
              unpausedBlock,
              pausedBlock,
            ] = await Promise.all([
              SeigManager.methods.isCommissionRateNegative(layer2).call(),
              SeigManager.methods.paused().call(),
              SeigManager.methods.lastSeigBlock().call(),
              SeigManager.methods.unpausedBlock().call(),
              SeigManager.methods.pausedBlock().call(),
            ]);

            let [
              seigPerBlock,
              commissionRate,
              prevTotTotalSupply,
              prevTotBalance,
              prevCoinageTotalSupply,
              prevCoinageOperatorBalance,
              prevCoinageUserBalance,
            ] = await Promise.all([
              SeigManager.methods.seigPerBlock().call(),
              SeigManager.methods.commissionRates(layer2).call(),
              Tot.methods.totalSupply().call(),
              Tot.methods.balanceOf(layer2).call(),
              Coinage.methods.totalSupply().call(),
              Coinage.methods.balanceOf(operator).call(),
              Coinage.methods.balanceOf(user).call(),
            ]);

            seigPerBlock = _WTON(seigPerBlock, WTON_UNIT);
            commissionRate = _WTON(commissionRate, WTON_UNIT);
            prevTotTotalSupply = _WTON(prevTotTotalSupply, WTON_UNIT);
            prevTotBalance = _WTON(prevTotBalance, WTON_UNIT);
            prevCoinageTotalSupply = _WTON(prevCoinageTotalSupply, WTON_UNIT);
            prevCoinageOperatorBalance = _WTON(
              prevCoinageOperatorBalance,
              WTON_UNIT
            );
            prevCoinageUserBalance = _WTON(prevCoinageUserBalance, WTON_UNIT);
            const prevCoinageUsersBalance = prevCoinageTotalSupply.minus(
              prevCoinageOperatorBalance
            );

            function calcNumSeigBlocks () {
              if (paused) return 0;

              const span = blockNumber - lastSeigBlock + 1; // + 1 for new block

              if (unpausedBlock < lastSeigBlock) {
                return span;
              }

              return span - (unpausedBlock - pausedBlock);
            }

            function increaseTot () {
              const maxSeig = seigPerBlock.times(calcNumSeigBlocks());
              const tos = _WTON(tonTotalSupply, TON_UNIT)
                .plus(_WTON(totTotalSupply, WTON_UNIT))
                .minus(_WTON(tonBalanceOfWTON, TON_UNIT));

              const stakedSeigs = maxSeig.times(prevTotTotalSupply).div(tos);
              return stakedSeigs;
            }

            const stakedSeigs = increaseTot();
            let layer2Seigs, operatorSeigs, usersSeigs;
            if (prevTotTotalSupply.isEqual(_WTON('0'))) {
              layer2Seigs = _WTON('0', WTON_UNIT);
            } else {
              layer2Seigs = stakedSeigs
                .times(prevTotBalance)
                .div(prevTotTotalSupply);
            }

            if (prevCoinageTotalSupply.isEqual(_WTON('0'))) {
              operatorSeigs = _WTON('0', WTON_UNIT);
              usersSeigs = _WTON('0', WTON_UNIT);
            } else {
              operatorSeigs = layer2Seigs
                .times(prevCoinageOperatorBalance)
                .div(prevCoinageTotalSupply);
              usersSeigs = layer2Seigs
                .times(prevCoinageUsersBalance)
                .div(prevCoinageTotalSupply);
            }

            function _calcSeigsDistribution () {
              let operatorSeigsWithCommissionRate = operatorSeigs;
              let usersSeigsWithCommissionRate = usersSeigs;

              if (commissionRate.toFixed(WTON_UNIT) === '0') {
                return {
                  operatorSeigsWithCommissionRate,
                  usersSeigsWithCommissionRate,
                };
              }

              if (!isCommissionRateNegative) {
                const commissionFromUsers = usersSeigs.times(commissionRate);

                operatorSeigsWithCommissionRate = operatorSeigsWithCommissionRate.plus(
                  commissionFromUsers
                );
                usersSeigsWithCommissionRate = usersSeigsWithCommissionRate.minus(
                  commissionFromUsers
                );
                return {
                  operatorSeigsWithCommissionRate,
                  usersSeigsWithCommissionRate,
                };
              }

              if (
                prevCoinageTotalSupply.toFixed(WTON_UNIT) === '0' ||
                prevCoinageOperatorBalance.toFixed(WTON_UNIT) === '0'
              ) {
                return {
                  operatorSeigsWithCommissionRate,
                  usersSeigsWithCommissionRate,
                };
              }

              const commissionFromOperator = operatorSeigs.times(
                commissionRate
              );

              operatorSeigsWithCommissionRate = operatorSeigsWithCommissionRate.minus(
                commissionFromOperator
              );
              usersSeigsWithCommissionRate = usersSeigsWithCommissionRate.plus(
                commissionFromOperator
              );

              return {
                operatorSeigsWithCommissionRate,
                usersSeigsWithCommissionRate,
              };
            }

            const {
              operatorSeigsWithCommissionRate,
              usersSeigsWithCommissionRate,
            } = _calcSeigsDistribution();

            let userSeigsWithCommissionRate;
            if (prevCoinageUsersBalance.isEqual(_WTON('0', WTON_UNIT))) {
              userSeigsWithCommissionRate = _WTON('0', WTON_UNIT);
            } else {
              userSeigsWithCommissionRate = usersSeigsWithCommissionRate
                .times(prevCoinageUserBalance)
                .div(prevCoinageUsersBalance);
            }

            return {
              operatorSeigs: operatorSeigsWithCommissionRate,
              userSeigs: userSeigsWithCommissionRate,
              layer2Seigs: layer2Seigs,
            };
          };
          const [
            totalDeposit,
            selfDeposit,
            userDeposit,
            totalStaked,
            selfStaked,
            userStaked,
            pendingRequests,
            pendingUnstakedLayer2,
            seigs, // operatorSeigs, userSeigs, layer2Seigs
            isCommissionRateNegative,
            commissionRate,
            powerTONSeigRate,
            daoSeigRate,
            relativeSeigRate,
            delayedCommissionRateNegative,
            delayedCommissionRate,
            delayedCommissionBlock,
            withdrawalDelay,
            globalWithdrawalDelay,
            minimumAmount,
          ] = await Promise.all([
            getDeposit(),
            getDeposit(operator),
            getDeposit(user),
            Coinage.methods.totalSupply().call(),
            Coinage.methods.balanceOf(operator).call(),
            Coinage.methods.balanceOf(user).call(null, blockNumber),
            getPendingRequests(),
            DepositManager.methods.pendingUnstakedLayer2(layer2).call(),
            getExpectedSeigs(),
            SeigManager.methods.isCommissionRateNegative(layer2).call(),
            SeigManager.methods.commissionRates(layer2).call(),
            SeigManager.methods.powerTONSeigRate().call(),
            SeigManager.methods.daoSeigRate().call(),
            SeigManager.methods.relativeSeigRate().call(),
            SeigManager.methods.delayedCommissionRateNegative(layer2).call(),
            SeigManager.methods.delayedCommissionRate(layer2).call(),
            SeigManager.methods.delayedCommissionBlock(layer2).call(),
            DepositManager.methods.withdrawalDelay(layer2).call(),
            DepositManager.methods.globalWithdrawalDelay().call(),
            SeigManager.methods.minimumAmount().call(),
          ]);
          const lastFinalized = await getRecentCommit(operator, layer2);
          const isCandidate = candidates.find(
            (candidate) => candidate.layer2 === layer2.toLowerCase()
          );
          if (isCandidate.kind === 'candidate') {
            const web3 = context.state.web3;
            const candi = candidateContractCreated.filter(
              (candidate) =>
                candidate.data.candidateContract.toLowerCase() === layer2
            );
            const block = await web3.eth.getBlock(candi[0].txInfo.blockNumber);
            operatorFromLayer2.deployedAt = block.timestamp;
            operatorFromLayer2.lastFinalizedAt =
              lastFinalized[0] === '0' ? block.timestamp : lastFinalized[0];
          } else if (
            isCandidate.kind !== 'candidate' ||
            isCandidate.kind === '' ||
            isCandidate.kind === 'layer2'
          ) {
            const [firstEpoch] = await Promise.all([
              Layer2.methods.getEpoch(0, 0).call(),
            ]);

            const deployedAt = firstEpoch.timestamp;
            operatorFromLayer2.deployedAt = deployedAt;
            operatorFromLayer2.lastFinalizedAt =
              lastFinalized[0] === '0' ? deployedAt : lastFinalized[0];
          }
          const delegators = await getDelegators(
            context.state.networkId,
            layer2
          );
          const commitHistory = await getCommitHistory(
            context.state.networkId,
            layer2
          );
          const operatorsHistory = await getOperatorUserHistory(
            context.state.networkId,
            layer2
          );
          operatorFromLayer2.delegators = delegators;
          const tos = toBN(tonTotalSupply)
            .mul(toBN('1000000000'))
            .add(toBN(totTotalSupply))
            .sub(toBN(tonBalanceOfWTON));

          const seigniorage = calculateExpectedSeig(
            new BN(await SeigManager.methods.lastCommitBlock(layer2).call()),
            new BN(blockNumber),
            new BN(userStaked),
            new BN(await Tot.methods.totalSupply().call()),
            new BN(tos),
            new BN(await SeigManager.methods.relativeSeigRate().call())
          );
          const notWithdrawableRequests = filterNotWithdrawableRequests(
            pendingRequests
          );
          const withdrawableRequests = filterWithdrawableRequests(
            pendingRequests
          );
          const userNotWithdrawable = getUserNotWithdrawable(
            notWithdrawableRequests
          );
          const userWithdrawable = getUserWithdrawable(withdrawableRequests);
          operatorFromLayer2.address = operator;
          operatorFromLayer2.finalizeCount = commitHistory.length !== 0? (commitHistory.length).toString() : '0';
          operatorFromLayer2.totalDeposit = _WTON(totalDeposit, WTON_UNIT);
          operatorFromLayer2.totalStaked = _WTON(totalStaked, WTON_UNIT);
          operatorFromLayer2.selfDeposit = _WTON(selfDeposit, WTON_UNIT);
          operatorFromLayer2.selfStaked = _WTON(selfStaked, WTON_UNIT);
          operatorFromLayer2.userDeposit = _WTON(userDeposit, WTON_UNIT);
          operatorFromLayer2.userStaked = _WTON(userStaked, WTON_UNIT);
          operatorFromLayer2.userSeigs = _WTON(seigniorage, WTON_UNIT);
          operatorFromLayer2.isCommissionRateNegative = isCommissionRateNegative;
          operatorFromLayer2.commissionRate = _WTON(commissionRate, WTON_UNIT);
          operatorFromLayer2.delayedCommissionRateNegative = delayedCommissionRateNegative;
          operatorFromLayer2.delayedCommissionRate = _WTON(
            delayedCommissionRate,
            WTON_UNIT
          );
          operatorFromLayer2.delayedCommissionBlock = delayedCommissionBlock;
          operatorFromLayer2.powerTONSeigRate = _WTON(
            powerTONSeigRate,
            WTON_UNIT
          );
          operatorFromLayer2.daoSeigRate = _WTON(daoSeigRate, WTON_UNIT);
          operatorFromLayer2.relativeSeigRate = _WTON(
            relativeSeigRate,
            WTON_UNIT
          );
          operatorFromLayer2.withdrawalRequests = pendingRequests;
          operatorFromLayer2.notWithdrawableRequests = notWithdrawableRequests;
          operatorFromLayer2.withdrawableRequests = withdrawableRequests;
          operatorFromLayer2.userNotWithdrawable = userNotWithdrawable;
          operatorFromLayer2.userWithdrawable = userWithdrawable;
          operatorFromLayer2.userRedelegatable = userWithdrawable.add(
            userNotWithdrawable
          );
          operatorFromLayer2.userReward = userNotWithdrawable;
          operatorFromLayer2.withdrawalDelay = withdrawalDelay;
          operatorFromLayer2.globalWithdrawalDelay = globalWithdrawalDelay;
          operatorFromLayer2.minimumAmount = minimumAmount;
          operatorFromLayer2.isCandidate = isCandidateOperator();
          operatorFromLayer2.commitHistory = commitHistory;
          operatorFromLayer2.operatorsHistory = operatorsHistory;
          operatorFromLayer2.pendingUnstakedLayer2 =  _WTON(pendingUnstakedLayer2, WTON_UNIT);
          return operatorFromLayer2;
        })
      );
      context.commit('SET_OPERATORS', operatorsFromLayer2);
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

      context.commit(
        'SET_USER_HISTORY',
        userHistory.map((h) => h.history)
      );
    },
    async setCurrentRound (context) {
      const user = context.state.user;
      const WTON = context.state.WTON;
      const PowerTON = context.state.PowerTON;

      const currentRoundIndex = await PowerTON.methods.currentRound().call();
      const [currentRound, balance, totalDeposits, power] = await Promise.all([
        PowerTON.methods.rounds(currentRoundIndex).call(),
        WTON.methods.balanceOf(PowerTON._address).call(),
        PowerTON.methods.totalDeposits().call(),
        PowerTON.methods.powerOf(user).call(),
      ]);
      const userPower = _POWER.ray(power);
      const totalPower = _POWER.ray(totalDeposits);
      const reward = new BN(balance);

      currentRound.index = currentRoundIndex;
      currentRound.reward = _WTON.ray(reward);
      // `.div` needs to check zero value
      if (!totalPower.eq(_POWER.ray('0'))) {
        const winningProbability = userPower.div(totalPower);
        currentRound.winningProbability = `${numeral(
          winningProbability.toNumber()
        ).format('0.00%')}`;
      } else {
        currentRound.winningProbability = '0.00%';
      }
      context.commit('SET_CURRENT_ROUND', currentRound);
    },
    async getWithdraw (context) {
      const DepositManager = context.state.DepositManager;
      const user = context.state.user;
      const withdraw = await DepositManager.methods
        .accUnstakedAccount(user)
        .call();
      context.commit('SET_TOTAL_WITHDRAW', _WTON.ray(withdraw.toString()));
    },

    async setRounds (context) {
      const PowerTON = context.state.PowerTON;
      const roundEndEvent = web3EthABI.encodeEventSignature(
        'RoundEnd(uint256,address,uint256)'
      );
      const deployedAt = PowerTON.transactionConfirmationBlocks;

      const events = await PowerTON.getPastEvents('RoundEnd', {
        fromBlock: deployedAt,
        toBlock: 'latest',
        topics: [roundEndEvent],
      });
      const rounds = events.map((event) => {
        const returnValues = event.returnValues;
        return {
          index: parseInt(returnValues.round),
          winner: returnValues.winner,
          reward: _WTON.ray(returnValues.reward),
        };
      });
      context.commit('SET_ROUNDS', rounds);
    },
    async setAccountsDepositedWithPower (context) {
      const PowerTON = context.state.PowerTON;
      const DepositManager = context.state.DepositManager;
      const depositedEvent = web3EthABI.encodeEventSignature(
        'Deposited(address,address,uint256)'
      );
      const deployedAt = DepositManager.transactionConfirmationBlocks;

      const events = await DepositManager.getPastEvents('Deposited', {
        fromBlock: deployedAt,
        toBlock: 'latest',
        topics: [depositedEvent],
      });

      const depositors = uniq(
        events.map((event) => event.returnValues.depositor)
      );
      const accounts = depositors.map(async (depositor) => {
        const power = await PowerTON.methods.powerOf(depositor).call();
        return {
          address: depositor.toLowerCase(),
          power: _POWER.ray(power.toString()),
        };
      });
      context.commit(
        'SET_ACCOUNTS_DEPOSITED_WITH_POWER',
        await Promise.all(accounts)
      );
    },
    async getPowerReward (context) {
      const networks = context.state.networkId;
      const rewards = await getRoundReward(1);
      context.commit('SET_POWER_REWARD', rewards.slice(0, 2));
    },
    async addAccountDepositedWithPower (context, depositor) {
      const PowerTON = context.state.PowerTON;
      const power = await PowerTON.methods.powerOf(depositor).call();
      context.commit('ADD_ACCOUNT_DEPOSITED_WITH_POWER', {
        address: depositor.toLowerCase(),
        power: _POWER.ray(power.toString()),
      });
    },
    setSelectedOperator (context, selected) {
      context.commit('SET_SELECTED_OPERATOR', selected);
    },
  },
  getters: {
    initialState: (state) => {
      return isEqual(state, initialState);
    },
    operatorsStaked: (state) => {
      if (state.operators && state.operators.length > 0) {
        return state.operators.filter(
          (operator) => parseInt(operator.userStaked) > 0
        );
      } else return [];
    },
    operatorByLayer2: (state) => (layer2) => {
      if (state.signIn) {
        return cloneDeep(
          state.operators
            .find(
              (operator) =>
                operator.layer2.toLowerCase() === layer2.toLowerCase()
            )
        );
      } else {
        return cloneDeep(
          state.operatorsBeforeConnect.find(
            (operator) => operator.layer2.toLowerCase() === layer2.toLowerCase()
          )
        );
      }
    },
    transactionsByOperator: (state) => (operator) => {
      return state.transactions.filter(
        (transaction) =>
          transaction.target.toLowerCase() === operator.toLowerCase()
      );
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
    userTotalSeigs: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) => amount.add(operator.userSeigs);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalNotWithdrawable: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) =>
        amount.add(operator.userNotWithdrawable);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalWithdrawable: (state) => {
      const initialAmount = _WTON.ray('0');
      const reducer = (amount, operator) =>
        amount.add(operator.userWithdrawable);

      return state.operators.reduce(reducer, initialAmount);
    },
    userTotalReward: (_, getters) => {
      return getters.userTotalStaked
        .add(getters.userTotalWithdrawable)
        .add(getters.userTotalNotWithdrawable);
      // .sub(getters.userTotalDeposit);
    },
    // rankedAccountsWithPower: (state) => {
    //   const accounts = state.accountsDepositedWithPower;
    //   const orderedAccounts = orderBy(accounts, (account) => account.power.toNumber(), ['desc']);

    //   let rank = 1;
    //   orderedAccounts.forEach(account => {
    //     account.rank = rank;
    //     rank++;
    //   });
    //   return orderedAccounts;
    // },
    recentTransactions: (state) => {
      const orderedTransactions = orderBy(
        state.transactions,
        (transaction) => transaction.blockNumber,
        ['desc']
      );
      return orderedTransactions.slice(0, 5);
    },
    coinageContract: (_) => (coinage) => {
      return createWeb3Contract(AutoRefactorCoinageABI, coinage);
    },
  },
});
