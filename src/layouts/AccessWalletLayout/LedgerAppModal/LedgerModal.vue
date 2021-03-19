5<template>
  <div class="modal-ledger">
    <img src="@/assets/images/modal-close.svg" alt="" width="30" height="30"
         @click="close"
    >
    <div class="block-title">
      <h4>Connect Ledger Live or Legacy</h4>
    </div>
    <div class="ledger-container">
      <div class="image-section">
        <img src="@/assets/images/LedgerNano.jpeg" alt="" width="30" height="30">
      </div>
      <div class="content-section">
        <div class="ledger-type">Ledger live</div>
        <div class="path">m/44'/60'/0'/x</div>
      </div>
      <div class="button-container">
        <base-button :label="'Connect'" class="button" :func="live" />
      </div>
    </div>
    <div class="ledger-container">
      <div class="image-section">
        <img src="@/assets/images/LedgerNano.jpeg" alt="" width="30" height="30">
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
  padding: 15px 15px 15px 15px;

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

  > .ledger-container {
    font-family: Roboto;
    font-size: 24px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #3e495c;
    display: flex;
    align-items: center;

    margin-bottom: 10px;
    border: solid 1px #3e495c;
    border-radius: 4px;

    > .image-section{
      margin: 5px 30px 0 15px;
    }

    > .content-section {
      width: 150px;
      font-size: 15px;
      // margin-right: 100px;
    }
    > .content-section > .ledger-type {
      font-size: 20px;
      margin: 10px 0 0 0;
      font-weight: 500;
    }
    > .content-section > .path {
      margin-bottom: 10px;
    }

    > .button-container {
      color: #ffffff;
      background-color: #37a18c;
      border: 1px solid #6fc4b3;
      text-align: center;
      font-size: 10px;

      margin-left: 100px;
      margin-right: 16px;
      border-radius: 6px;
      padding: 4px 10px 4px 10px;
    }

    > .button-container:hover {
      -webkit-filter: opacity(.8);
      filter: opacity(.8);
    }
  }
}
</style>
