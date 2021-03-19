<template>
  <b-modal
    ref="networkAndAddress"
    :title="$t('accessWallet.network-addr.string')"
    hide-footer
    class="bootstrap-modal nopadding modal-network-and-address"
    centered
    static
    lazy
  >
    <div class="modal-content-container">
      <div class="collapse-container">
        <b-btn
          v-b-toggle.collapse2
          class="collapse-open-button"
          variant="primary"
        >
          <p class="button-number">2</p>
          <p>{{ $t('common.addr') }}</p>
        </b-btn>
        <!-- Derivation Path Drop down -->
        <!-- Address List -->
        <div class="content-container-2">
          <div class="address-block-container">
            <div class="block-title">
              <h4>Address to Interact With</h4>
            </div>

            <ul class="address-block table-header fours">
              <li>ID</li>
              <li>Address</li>
            </ul>
            <ul
              v-for="account in HDAccounts"
              :key="account.index"
              :data-address="'address' + account.index"
              :class="[
                selectedId === 'address' + account.index ? 'selected' : '',
                'address-block address-data fours'
              ]"
              @click="setAccount(account)"
            >
              <li>
                <blockie
                  :address="account.account.getChecksumAddressString()"
                  :size="8"
                  :scale="16"
                  width="30px"
                  height="30px"
                />
              </li>
              <li class="monospace address-icon-container">
                {{ account.account.getChecksumAddressString() | concatAddr }}
                <!-- <i
                  class="fa fa-files-o"
                  @click="
                    () => {
                      copyAddress(account.account.getChecksumAddressString());
                    }
                  "
                /> -->
              </li>
              <li class="user-input-checkbox">
                <label class="checkbox-container checkbox-container-small">
                  <input
                    :id="'address' + account.index"
                    type="checkbox"
                    @click="unselectAllAddresses"
                  >
                  <span class="checkmark checkmark-small" />
                </label>
              </li>
            </ul>
          </div>
          <!-- .address-block-container -->
          <div class="address-nav">
            <span @click="previousAddressSet()">&lt; Previous</span>
            <span @click="nextAddressSet()">Next &gt;</span>
          </div>
        </div>
        <!-- .content-container-2 -->
        <div class="button-container">
          <b-btn
            :disabled="!isDisabled"
            class="mid-round-button-green-filled close-button"
            @click.prevent="unlockWallet"
          >
            Access wallet
          </b-btn>
        </div>
        <customer-support />
      </div>
    </div>
    <!-- .modal-content-container -->
  </b-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Misc, pathHelpers } from '@/helpers';
import web3utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import { LEDGER as LEDGER_TYPE } from '@/wallets/bip44/walletTypes';
// import clipboardCopy from 'clipboard-copy';

const MAX_ADDRESSES = 5;
export default {
  components: {
  },
  props: {
    hardwareWallet: {
      type: Object,
      default: function () {
        return {};
      },
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
    ...mapState('main', [
      'network',
      'Networks',
      'customPaths',
      'path',
      'web3',
      'wallets',
    ]),
    selectedNetwork () {
      return this.network;
    },
    reorderNetworkList () {
      return Misc.reorderNetworks();
    },
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
  mounted () {
    // reset component values when modal becomes hidden
    this.$refs.networkAndAddress.$on('hidden', () => {
      this.availablePaths = {};
      this.selectedPath = '';
      this.invalidPath = '';
      this.customPathInput = false;
      this.currentWallet = null;
      this.customPath = { label: '', path: '' };
      this.resetPaginationValues();
    });
  },
  methods: {
    ...mapActions('main', [
      'switchNetwork',
      'setWeb3Instance',
      'removeCustomPath',
      'addCustomPath',
      'decryptWallet',
    ]),
    // copyAddress (val) {
    //   clipboardCopy(val);
    //   Toast.responseHandler(this.$t('common.copied'), Toast.SUCCESS);
    // },
    getExplorrerLink (addr) {
      return this.network.type.blockExplorerAddr.replace('[[address]]', addr);
    },
    locSwitchNetwork (network) {
      this.switchNetwork(network).then(() => {
        this.setWeb3Instance();
        this.currentIndex = 0;
        this.setHDAccounts();
      });
    },
    unselectAllAddresses: function (selected) {
      document
        .querySelectorAll('.user-input-checkbox input')
        .forEach(function (el) {
          el.checked = el.id === selected;
        });
    },
    setAccount (account) {
      this.selectedId = 'address' + account.index;
      this.unselectAllAddresses('address' + account.index);
      this.currentWallet = account.account;
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
          this.$refs.networkAndAddress.show();
        })
        .catch(error => {
          // if HD path is not supported by the hardware
          this.HDAccounts = [];
          // Toast.responseHandler(error, Toast.ERROR);
        });
      this.selectedPath = this.hardwareWallet.getCurrentPath();
    },
    setBalances: web3utils._.debounce(function () {
      this.HDAccounts.forEach(account => {
        if (account.account) {
          this.web3.eth
            .getBalance(account.account.getAddressString())
            .then(balance => {
              account.balance = balance;
            })
            .catch(e => {
              // Toast.responseHandler(e, Toast.ERROR);
            });
        } else {
          account.balance = 0;
        }
      });
    }, 1000),
    unlockWallet () {
      this.decryptWallet([this.currentWallet])
        .then(() => {
          if (this.wallet !== null) {
            if (!this.$route.path.split('/').includes('interface')) {
              this.$router.push({
                path: 'interface',
              });
            }
          }

          this.$refs.networkAndAddress.hide();
        })
        .catch(error => {
          // the wallet param (param[0]) is undefined or null
          // Toast.responseHandler(error, Toast.ERROR);
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
            balance: 'loading',
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
@import 'NetworkAndAddressModal-desktop.scss';
@import 'NetworkAndAddressModal-tablet.scss';
@import 'NetworkAndAddressModal-mobile.scss';

.activeConn {
  color: gray;
}
</style>

<style lang="scss">
.dropdown-paths {
  .dropdown-item {
    align-items: center;
    display: flex !important;
    justify-content: space-between;
  }
}
</style>
