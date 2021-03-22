<template>
  <div class="modal-accounts">
    <img src="@/assets/images/modal-close.svg" alt="" width="30" height="30"
         @click="close"
    >
    <div class="block-title">
      <h4>Address to Interact With</h4>
    </div>
    <div
      v-for="account in accounts"
      :key="account.index"
      :data-address="'address' + account.index"
      class="account-container"
      @click="setAccount(account)"
    >
      {{ account.account.getChecksumAddressString() | hexSlicer }}
    </div>
    <div class="button-container">
      <base-button :label="'Access Wallet'" @click.prevent="unlockWallet" />
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';

import { mapState, mapActions } from 'vuex';
import { Misc, pathHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { LEDGER as LEDGER_TYPE } from '@/wallets/bip44/walletTypes';

const MAX_ADDRESSES = 10;
export default {
  components: {
    'base-button': BaseButton,
  },
  props: {
    hardwareWallet: {
      type: Object,
      default: function () {
        return {};
      },
    },
    accounts: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      selectedId: '',
      currentIndex: 0,
      HDAccounts: [],
      availablePaths: {},
      selectedPath: '',
      invalidPath: '',
      customPathInput: false,
      currentWallet: null,
      customPath: { label: '', dpath: '' },
      showCollapse: false,
      ledgerType: LEDGER_TYPE,
      acceptTerms: false,
    };
  },
  computed: {
    ...mapState([
      'customPaths',
      'path',
      'web3',
      'wallets',
      'web3Instance',
    ]),
    isDisabled () {
      return this.selectedId !== '' && this.acceptTerms;
    },
  },
  watch: {
    hardwareWallet () {
      this.getPaths();
      this.setHDAccounts();
    },
  },
  methods: {
    ...mapActions([
      'switchNetwork',
      'setWeb3Instance',
      'removeCustomPath',
      'addCustomPath',
      'decryptWallet',
    ]),
    close () {
      this.$emit('on-closed');
    },
    unselectAllAddresses: function (selected) {
      document
        .querySelectorAll('.user-input-checkbox input')
        .forEach(function (el) {
          el.checked = el.id === selected;
        });
    },
    resetPaginationValues () {
      this.currentIndex = 0;
    },
    showCustomPathInput () {
      this.customPath = { label: '', path: '' };
      this.customPathInput = !this.customPathInput;
    },
    convertBalance (bal) {
      if (bal === 'loading') return bal;
      return new BigNumber(web3utils.fromWei(bal, 'ether')).toFixed(3);
    },
    removeCustomPathLocal (path) {
      this.removeCustomPath(path).then(() => {
        this.getPaths();
      });
    },
    locAddCustomPath () {
      const customPath = pathHelpers.checkCustomPath(this.customPath.path);
      if (customPath) {
        this.customPath.path = customPath;
        this.addCustomPath({
          label: this.customPath.label,
          path: customPath,
        }).then(() => {
          this.getPaths();
        });
        this.showCustomPathInput(); // reset the path input
      } else {
        this.invalidPath = this.customPath;
      }
    },
    changePath (key) {
      this.resetPaginationValues();
      let selectedPath;
      if (this.availablePaths[key]) {
        selectedPath = this.availablePaths[key].path;
      } else if (this.customPaths[key]) {
        selectedPath = this.customPaths[key].path;
      } else {
        selectedPath = this.selectedPath;
      }

      this.hardwareWallet
        .init(selectedPath)
        .then(() => {
          this.getPaths();
          this.currentIndex = 0;
          this.setHDAccounts();
        })
        .catch(error => {
          // if HD path is not supported by the hardware
          this.HDAccounts = [];
          // Toast.responseHandler(error, Toast.ERROR);
        });
      this.selectedPath = this.hardwareWallet.getCurrentPath();
    },
    setAccount (account) {
      this.selectedId = 'address' + account.index;
      this.unselectAllAddresses('address' + account.index);
      this.currentWallet = account.account;
      this.unlockWallet(this.currentWallet);
    },
    async unlockWallet (currentWallet) {
      // console.log(currentWallet);
      this.decryptWallet([currentWallet])
        .then(async () => {
          if (this.web3Instance != null) {
            console.log(this.web3Instance);
            await this.$store.dispatch('signInLedger', this.web3Instance);
            this.close();
          }
        });
    },
    async setHDAccounts () {
      try {
        if (!this.web3.eth) this.setWeb3Instance();
        this.HDAccounts = [];
        for (
          let i = this.currentIndex;
          i < this.currentIndex + MAX_ADDRESSES;
          i++
        ) {
          const account = await this.hardwareWallet.getAccount(i);
          this.HDAccounts.push({
            index: i,
            account: account,
          });
          this.setBalances();
        }
        this.currentIndex += MAX_ADDRESSES;
      } catch (e) {
        // Toast.responseHandler(e, Toast.ERROR);
      }
    },
    nextAddressSet () {
      this.setHDAccounts();
    },
    previousAddressSet () {
      this.currentIndex =
        this.currentIndex - 2 * MAX_ADDRESSES < 0
          ? 0
          : this.currentIndex - 2 * MAX_ADDRESSES;
      this.setHDAccounts();
    },
    getPathLabel (path) {
      for (const _p in this.customPaths) {
        if (this.customPaths[_p].path === path) {
          return this.customPaths[_p].label;
        }
      }

      for (const _p in this.availablePaths) {
        if (this.availablePaths[_p].path === path) {
          return this.availablePaths[_p].label;
        }
      }

      return 'Unknown';
    },
    getPaths () {
      this.selectedPath = this.hardwareWallet.getCurrentPath();
      this.availablePaths = this.hardwareWallet.getSupportedPaths();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-accounts {
  position: relative;
  padding: 0 15px 15px 15px;

  font-family: Roboto;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;

  max-height: 90vh;
  overflow-y: scroll;

  > img {
    position: absolute;
    right: 10px;
    top: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  > .block-title {
    font-size: 24px;
    font-weight: 500;
    text-align: left;
    color: #3e495c;

    padding-top: 30px;
    margin-bottom: 5px;
  }
  > .account-container {
    font-size: 15px;
    border: solid 1px #3e495c;
    border-radius: 4px;
    padding: 10px 0 10px 10px;
    margin-bottom: 7px;
  }
}
</style>
