import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isModalShowed: false,
    isWalletConnected: false,
    account: '',
    networkId: '',
    balance: '',
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
    showModal ( { commit }) {
      commit('SHOW_MODAL', true);
    },
    closeModal ( { commit }) {
      commit('SHOW_MODAL', false);
    },
  },
  modules: {
  },
});
