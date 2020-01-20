import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialState = {
  modalType: '',
  isModalShowed: false,
  isWalletConnected: false,
  web3: null,
  account: '',
  networkId: '',
  balance: '',
  operatorList: [
    {
      'address': '1000',
      'name': '2000',
      'timestamp': '3000',
      'commission': '4000',
    },
  ],
  myStakeInfoList: [],
  historyList: [],
};

const getInitialState = () => initialState;

export default new Vuex.Store({
  state: {
    web3: null,
    modalType: '',
    isModalShowed: false,
    isWalletConnected: false,
    account: '',
    networkId: '',
    balance: '',
    operatorList: [
      {
        'address': '1000',
        'name': '20000',
        'timestamp': '3000',
        'commission': '4000',
      },
    ],
    myStakeInfoList: [],
    historyList: [],
  },
  mutations: {
    SET_WALLET_CONNECTION_STATE: (state, isWalletConnected) => {
      state.isWalletConnected = isWalletConnected;
    },
    SET_INITIAL_STATE: (state) => {
      const initialState = getInitialState();
      Object.keys(initialState).forEach((key) => {
        state[key] = initialState[key];
      });
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
  },
  actions: {
    setWalletInfo ({ commit }, walletInfo) {
      const web3 = walletInfo.web3;
      const account = walletInfo.account;
      const networkId = walletInfo.networkId;
      const balance = walletInfo.balance;

      commit('SET_WEB3', web3);
      commit('SET_ACCOUNT', account);
      commit('SET_NETWORK_ID', networkId);
      commit('SET_BALANCE', balance);
      commit('SET_WALLET_CONNECTION_STATE', true);
    },
    logout ({ commit }) {
      commit('SET_INITIAL_STATE');
    },
    showModal ( { commit }, modalType) {
      commit('SET_MODAL_TYPE', modalType);
      commit('SHOW_MODAL', true);
    },
    closeModal ( { commit }) {
      commit('SET_MODAL_TYPE', '');
      commit('SHOW_MODAL', false);
    },
  },
});
