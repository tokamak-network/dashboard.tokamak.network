<template>
  <div class="modal-ledger">
    <img src="@/assets/images/modal-close.svg" alt="" width="30" height="30"
         @click="close"
    >
    <div class="block-title">
      Connect Ledger Live or Legacy
    </div>
    <div class="line" />
    <div class="ledger-container">
      <div class="image-section">
        <img src="@/assets/images/ledger-icon.svg" alt="" width="30" height="30">
      </div>
      <div class="content-section">
        <div class="ledger-type">Ledger live</div>
        <div class="path">m/44'/60'/0'/x</div>
      </div>
      <div class="button-container">
        <base-button :label="'Connect'" class="button" :func="live" />
      </div>
    </div>
    <div class="line" />
    <div class="ledger-container">
      <div class="image-section">
        <img src="@/assets/images/ledger-icon.svg" alt="" width="30" height="30">
      </div>
      <div class="content-section">
        <div class="ledger-type">Ledger legacy</div>
        <div class="path">m/44'/x'/0/0</div>
      </div>
      <div class="button-container">
        <base-button :label="'Connect'" class="button" :func="legacy" />
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/BaseButton.vue';
import { LedgerWallet } from '@/wallets';

export default {
  components: {
    'base-button': BaseButton,
  },
  data () {
    return {
      selectedApp: {
        paths: '',
      },
    };
  },
  watch: {
    selectedApp: {
      handler: function (newVal) {
        this.selectedPath = newVal.paths[0];
      },
      deep: true,
    },
  },
  methods: {
    live () {
      const path = 'm/44\'/60\'';
      this.continue(path);
    },
    legacy () {
      const path = 'm/44\'/60\'/0\'';
      this.continue(path);
    },
    continue (path) {
      LedgerWallet(path)
        .then(_newWallet => {
          this.$emit('hardwareWalletOpen', _newWallet);
          this.$emit('on-closed');
        })
        .catch(e => {
          LedgerWallet.errorHandler(e);
        });
    },
    close () {
      this.$emit('on-closed');
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-ledger {
  position: relative;
  width: 280px;
  height: 200px;
  overflow-y: scroll;

  > .block-title {
    margin: 15px 0 14px 25px;
    font-size: 16px;
    color: #3d495d;
    width: 115px;
  }

  > img {
    position: absolute;
    right: 10px;
    top: 10px;

    &:hover {
      cursor: pointer;
    }
  }

  > .line {
    width: 280px;
    height: 1px;
    // margin: 14px 0 0;
    background-color: #f4f6f8;
  }

  > .ledger-container {
    font-family: Roboto;
    font-size: 16px;
    // font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #3e495c;
    display: flex;
    align-items: center;

    border-radius: 4px;

    > .image-section{
      margin: 5px 15px 0 15px;
    }

    > .content-section {
      width: 150px;
      font-size: 14px;
    }
    > .content-section > .ledger-type {
      font-size: 14px;
      margin: 10px 0 0 0;
      font-weight: 500;
      color: #3d495d;
    }
    > .content-section > .path {
      margin-bottom: 10px;
      font-size: 12px;
      color: #86929d;
    }

    > .button-container {
      color: #ffffff;
      background-color: #257eee;
      margin-right: 20px;
      border-radius: 4px;
      padding: 4px 10px 4px ;

      > .button {
        font-size: 12px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.33;
        letter-spacing: 0.3px;
        text-align: center;
      }
    }

    > .button-container:hover {
      -webkit-filter: opacity(.8);
      filter: opacity(.8);
    }
  }
}
</style>
