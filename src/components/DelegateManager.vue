<template>
  <div class="delegate-manager">
    <div style="padding: 16px;">
      <div class="header">
        <div class="title">
          Staking
        </div>
        <button
          class="tab left"
          @click="changeTab('delegate')"
        >
          Delegate
        </button>
        <button
          class="tab right"
          @click="changeTab('undelegate')"
        >
          Undelegate
        </button>
      </div>
      <div class="divider" />
      <form v-if="tab === 'delegate'">
        <div class="body">
          <div class="has-border">
            AMOUNT
          </div>
          <div class="ton-input">
            <input
              v-model="amountToDelegate"
              style="height: 26px; border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;
            width: 100%; border-top: 1px solid #b4b4b4;
            border-bottom: 1px solid #b4b4b4; font-size: 16px; text-align: right;
            padding-right: 16px;"
              @keypress="isNumber"
            >
          </div>
          <div class="has-border">
            TON
          </div>
        </div>
        <div style="display: flex; margin-top: 8px;">
          <div style="flex: 1; font-size: 14px; color: #586064">
            Delegate 가능한 Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            <!-- {{ userUndepositedBalance }} -->
            {{ wtonBalance }}
          </div>
        </div>
        <div class="request-button">
          <standard-button
            :label="'Delegate TON'"
            :func="delegate"
          />
        </div>
      </form>
      <form v-else>
        <div class="body">
          <div class="has-border">
            AMOUNT
          </div>
          <div class="ton-input">
            <input
              style="height: 26px; border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;
            width: 100%; border-top: 1px solid #b4b4b4;
            border-bottom: 1px solid #b4b4b4; font-size: 16px; text-align: right;
            padding-right: 16px;"
              @keypress="isNumber"
            >
          <!-- style="width: 100%; border:none;border-right:0px; border-top:0px; boder-left:0px; boder-bottom:0px;" -->
          </div>
          <div class="has-border">
            TON
          </div>
        </div>
        <div style="display: flex;  padding-top: 8px;">
          <div style="flex: 1; font-size: 14px; color: #586064;">
            Undelegate 가능한 Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            200 TON
          </div>
        </div>
        <button class="request-button">
          Request Undelegate TON
        </button>
        <div class="divider" />
        <div style="display: flex;">
          <div style="flex: 1; font-size: 14px; color: #586064">
            Request amount
          </div>
          <div style="font-size: 14px; color: #586064">
            1
          </div>
        </div>
        <div style="display: flex;">
          <div style="flex: 1; font-size: 14px; color: #586064">
            Pending Amount
          </div>
          <div style="font-size: 14px; color: #586064">
            1000 TON
          </div>
        </div>
        <div class="request-button">
          <standard-button
            :label="'Process All Requests'"
            :func="undelegate"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { padLeft } from 'web3-utils';
import { createCurrency } from '@makerdao/currency';
const _WTON = createCurrency('WTON');

import StandardButton from '@/components/StandardButton.vue';

export default {
  components: {
    'standard-button': StandardButton,
  },
  props: {
    operator: {
      type: Object,
      default: () => {},
    },
  },
  data () {
    return {
      tab: 'delegate',
      amountToDelegate: '',
      amountToUndelegate: '',
    };
  },
  computed: {
    ...mapState([
      'user',
      'DepositManager',
      'TON',
      'WTON',
      'tonBalance',
      'wtonBalance',
    ]),
    ...mapGetters([
      'userUndepositedBalance',
    ]),
  },
  methods: {
    changeTab (tab) {
      this.tab = tab;
    },
    delegate () {
      const data = this.getData();
      // const func = async () => await this.TON.approveAndCall(
      //   this.WTON.address,
      //   _WTON(this.amountToDelegate).toFixed('ray'),
      //   data,
      //   { from: this.user }
      // );
      const func = async () => await this.DepositManager.deposit(
        this.operator.rootchain,
        _WTON(this.amountToDelegate).toFixed('ray'),
        { from: this.user }
      );

      this.$bus.$emit('txSended', {
        request: 'delegate',
        txSender: func,
      });
    },
    undelegate () {
      //
    },
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    marshalString (str) {
      if (str.slice(0, 2) === '0x') return str;
      return '0x'.concat(str);
    },
    unmarshalString (str) {
      if (str.slice(0, 2) === '0x') return str.slice(2);
      return str;
    },
    getData () {
      const data = this.marshalString(
        [this.DepositManager.address, this.operator.rootchain]
          .map(this.unmarshalString)
          .map(str => padLeft(str, 64))
          .join('')
      );

      return data;
    },
  },
};
</script>

<style scoped>
.delegate-manager {
  background: #ffffff;
  width: 400px;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
}

.header {
  display: flex;
}

.title {
  flex: 1;
  font-size: 18px;
  line-height: 2;
}

.tab {
  width: 90px;
  line-height: 2;
  font-size: 14px;
  text-align: center;
  color: #000000;
}

.tab:hover {
  cursor: pointer;
  background-color: slategray;
}

.left {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  z-index: 2;
}

.right {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.divider{
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 1px;
  background: #b4b4b4;
}

.body {
  display: flex;
  width: 100%;
  height: 30px;
}

.ton-input {
  flex: 1;
  margin-right: 17px;
  z-index: 2;
}

.has-border {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #b4b4b4;
  padding-left: 4px;
  padding-right: 4px;
}

.request-button {
  border: 1px solid #b4b4b4;
  text-align: center;
  margin-top: 16px;
  width: 100%;
  font-size: 14px;
  line-height: 2;
  border-radius: 4px;
}

.request-button:hover {
  -webkit-filter: opacity(.8);
  filter: opacity(.8);
}
</style>
