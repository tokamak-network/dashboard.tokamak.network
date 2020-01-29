const getWeb3 = {
  _instance: null,

  get instance () {
    if (!this._instance) {
      this._instance = {

        get web3 () {
          return this._web3;
        },

        set web3 (web3) {
          this._web3 = web3;
        },
      };
    }
    return this._instance;
  },
};

export default getWeb3;
