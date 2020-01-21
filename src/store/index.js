import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import api from '@/api/index.js';
import _ from 'lodash';

const initialState = {
  modalType: '',
  isModalShowed: false,
  isWalletConnected: false,
  web3: null,
  account: '',
  networkId: '',
  balance: '',
  operatorList: null,
  myStakeInfoList: null,
  historyList: null,
};

const getInitialState = () => initialState;

const sampleData = {
  operatorList: [
    {
      address: '0xdead',
      name: 'beef',
      timestamp: '10 minutes ago',
      commission: '2.5%',
    },
  ],
};

export default new Vuex.Store({
  state: _.cloneDeep(initialState),
  mutations: {
    SET_INITIAL_STATE: (state) => {
      const initialState = getInitialState();
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
    },
    SET_WALLET_CONNECTION_STATE: (state, isWalletConnected) => {
      state.isWalletConnected = isWalletConnected;
    },
    SET_WEB3: (state, web3) => {
      state.web3 = web3;
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account;
    },
    SET_NETWORK_ID: (state, networkId) => {
      state.networkId = networkId;
    },
    SET_BALANCE: (state, balance) => {
      state.balance = balance;
    },
    SHOW_MODAL: (state, isModalShowed) => {
      state.isModalShowed = isModalShowed;
    },
    SET_MODAL_TYPE: (state, type) => {
      state.modalType = type;
    },
    SET_OPERATOR_LIST: (state, operatorList) => {
      state.operatorList = operatorList;
    },
    SET_MY_STAKE_INFO_LIST: (state, infoList) => {
      state.myStakeInfoList = infoList;
    },
    SET_HISTORY_LIST: (state, historyList) => {
      state.historyList = historyList;
    },
  },
  actions: {
    setWalletInfo (context, walletInfo) {
      const web3 = walletInfo.web3;
      const account = walletInfo.account;
      const networkId = walletInfo.networkId;
      const balance = walletInfo.balance;

      context.commit('SET_WEB3', web3);
      context.commit('SET_ACCOUNT', account);
      context.commit('SET_NETWORK_ID', networkId);
      context.commit('SET_BALANCE', balance);
      context.commit('SET_WALLET_CONNECTION_STATE', true);
    },
    logout (context) {
      context.commit('SET_INITIAL_STATE');
    },
    showModal (context, modalType) {
      context.commit('SET_MODAL_TYPE', modalType);
      context.commit('SHOW_MODAL', true);
    },
    closeModal (context) {
      context.commit('SET_MODAL_TYPE', '');
      context.commit('SHOW_MODAL', false);
    },
    async checkAndGetData (context, type) {
      switch (type) {
      case 'operator':
        if (_.isNull(context.state.operatorList)) {
          await api.sample();
          context.commit('SET_OPERATOR_LIST', sampleData.operatorList);
        }
        break;
      case 'stakeInfo':
        break;
      case 'history':
        break;

      default:
        break;
      }
    },
  },
});
