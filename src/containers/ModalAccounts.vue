<template>
  <div class="modal-accounts">
    <img src="@/assets/images/modal-close.svg" alt="" width="30" height="30"
         @click="close"
    >
    <div class="block-title">
      Address to Interact With
    </div>
    <div class="line" />
    <div v-for="account in accounts" :key="account.index" class="account-container">
      <div class="select-container">
        <div
          :data-address="'address' + account.index"
          class="account"
          @click="setAccount(account)"
        >
          {{ account.account.getChecksumAddressString() | hexSlicer }}
        </div>
        <div class="select-button">
          <base-button :label="'Select'" class="button" @click.prevent="unlockWallet" />
        </div>
      </div>
      <div class="line" />
    </div>
    <div class="button-container">
      <button-step :type="'prev'" class="prev" @on-clicked="prev" />
      <button-step :type="'next'" class="next" @on-clicked="next" />
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import ButtonStep from '@/components/ButtonStep.vue';

import { mapState, mapActions } from 'vuex';
import { Misc, pathHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { LEDGER as LEDGER_TYPE } from '@/wallets/bip44/walletTypes';

const MAX_ADDRESSES = 10;
export default {
  components: {
    'button-step': ButtonStep,
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
  padding: 0 0 15px 0;

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
    margin: 25px 45px 24px 25px;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: normal;
    text-align: left;
    color: #3d495d;
  }

  > .account-container {
    font-size: 14px;
    border-radius: 4px;
    height: 40px;

    > .select-container {
      display: flex;
      justify-content: space-between;

      .account {
        padding: 10px 0px 10px 25px;
        font-size: 14px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        // line-height: 2.14;
        letter-spacing: 0.35px;
        text-align: left;
        color: #3d495d;
      }

      > .select-button {
        border-radius: 4px;
        border: solid 1px #dfe4ee;
        background-color: #ffffff;
        height: 22px;
        margin: 9px 20px 0 0;
        padding: 0 15px 0;
        color: #86929d;
        font-size: 12px;

        > .button {
          font-size: 12px;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: center;
          color: #86929d;
          padding-top: 4px;
        }
      }
      > .select-button:hover {
        border: solid 1px #2a72e5;
        background-color: #ffffff;

        > .button {
          color: #2a72e5;
        }
      }
    }
  }

  > .button-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    > .prev {
      // padding-right: 3px;
      width: 40px;
    }
    > .next {
      width: 40px;
    }
  }
}
.line {
  width: 280px;
  height: 1px;
  background-color: #f4f6f8;
  }
</style>
