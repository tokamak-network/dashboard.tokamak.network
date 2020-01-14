import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const initialState = function () {
  return {
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
        'commitTimestamp': '3000',
        'commissionRate': '4000',
      },
    ],
    myStakeInfoList: [],
    historyList: [],
  };
};

export default new Vuex.Store({
  state: {
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
        'commitTimestamp': '3000',
        'commissionRate': '4000',
      },
    ],
    myStakeInfoList: [],
    historyList: [],
  },
  mutations: {
    SET_WALLET_CONNECTION_STATE: (state, isWalletConnected) => {
      state.isWalletConnected = isWalletConnected;
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
    SET_INITIAL_STATE: (state) => {
      const s = initialState();
      Object.keys(s).forEach((key) => {
        state[key] = s[key];
      });
    },
  },
  actions: {
    setWalletInfo ({ commit }, walletInfo) {
      const account = walletInfo.account;
      const networkId = walletInfo.networkId;
      const balance = walletInfo.balance;

      commit('SET_ACCOUNT', account);
      commit('SET_NETWORK_ID', networkId);
      commit('SET_BALANCE', balance);
      commit('SET_WALLET_CONNECTION_STATE', true);
    },
    showModal ( { commit }, modalType) {
      commit('SET_MODAL_TYPE', modalType);
      commit('SHOW_MODAL', true);
    },
    closeModal ( { commit }) {
      commit('SHOW_MODAL', false);
    },
    logout ({ commit }) {
      commit('SET_INITIAL_STATE');
    },
  },
  modules: {
  },
});
