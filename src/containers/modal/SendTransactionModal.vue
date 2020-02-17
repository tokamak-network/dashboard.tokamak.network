<template>
  <transition name="modal">
    <div class="modal-mask">
      <div
        class="modal-wrapper"
        @click="$emit('modalClosed')"
      >
        <div
          class="modal-container"
          @click.stop
        >
          <div class="modal-body">
            <div class="modal-content">
              <div
                class="modal-close-container"
              >
                <img
                  class="modal-close-button"
                  src="@/assets/images/Close.png"
                  width="12"
                  height="12"
                  @click="closeModal"
                >
              </div>
              <div class="amount-label">
                Amount
              </div>
              <div
                style="display: flex; align-items: center;"
              >
                <input
                  ref="amount"
                  v-model="amount"
                  class="token-amount-input"
                  @keypress="isNumber"
                >
                <span class="modal-token-unit">WTON</span>
                <div
                  class="modal-set-max-button"
                  @click="setMax"
                >
                  SET MAX
                </div>
              </div>
              <div class="modal-available-to-claim">
                available to {{ modalData.type }}: {{ modalData.availableAmount }} WTON
              </div>
              <div class="modal-button-container">
                <div
                  class="modal-send-transaction-button"
                  @click="send"
                >
                  {{ modalData.type }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import { createCurrency } from '@makerdao/currency';

const _WTON = createCurrency('WTON');

export default {
  name: 'SendTransactionModal',
  data () {
    return {
      amount: '',
    };
  },
  computed: mapState([
    'modalData',
    'user',
    'web3',
    'sendFunc',
  ]),
  mounted () {
    this.$refs.amount.focus();
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closeModal');
    },
    setMax () {
      this.amount = this.modalData.availableAmount;
    },
    async send () {
      const amount = _WTON(this.amount).toFixed('ray');
      const depositFunc = this.modalData.func;

      this.$bus.$emit('txSended', {
        request: 'delegate',
        txSender: async () => await depositFunc(amount),
      });

      this.closeModal();
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
  },
};
</script>

<style scoped>
.modal-close-container {
  display: flex;
  flex-direction: row-reverse;
  margin-top: -26px;
  margin-right: -40px;
  margin-bottom: 10px;
}

.modal-close-button {
  padding: 12px;
}

.modal-close-button:hover {
  cursor: pointer;
  -webkit-filter: opacity(.4);
  filter: opacity(.4);
}

.modal-token-unit {
  margin-left: -58px;
  margin-right: 20px;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: left;
  color: #c4c4c4;
}

.modal-available-to-claim {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 300;
  font-stretch: normal;
  font-style: italic;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: left;
  color: #01375b;
}

.amount-label {
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: left;
  color: #01375b;
}

.modal-set-max-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 75px;
  height: 32px;
  border-radius: 3px;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  background-color: rgb(242, 115, 104);
  font-size: 11px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: rgb(227, 233, 235);
  margin-bottom: 1px;
}

.modal-set-max-button:hover {
  cursor: pointer;
  background-color: rgba(247, 115, 104, .8);
}

.modal-send-transaction-button {
  text-transform: capitalize;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 32px;
  border-radius: 3px;
  background-color: rgb(0, 90, 167);
  font-size: 14px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  letter-spacing: normal;
  text-align: left;
  color: rgb(227, 233, 235);
}

.modal-send-transaction-button:hover {
  cursor: pointer;
  background-color: rgba(0, 90, 167, .8);
}

.modal-button-container {
  width: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
}

.token-amount-input {
  flex: 1;
  height: 32px;
  border-radius: 3px;
  padding-left: 16px;
  box-shadow: 0 3px 14px 0 rgba(0, 0, 0, 0.03);
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: left;
  color: #5f5f5f;
  margin-right: 8px;
  margin-bottom: 2px;
}

.modal-content {
  margin-left: 56px;
  margin-right: 56px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 780px;
  height: 225px;
  border-radius: 20px;
  box-shadow: 4px 8px 40px 0 rgba(7, 7, 15, 0.5);
  background-color: #dee5e8;
  margin: 0px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-body {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: 100%;
}

.modal-body > :nth-child(3) {
  margin-top: 10px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.modal-button {
  padding-left: 50px;
  padding-right: 50px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>
