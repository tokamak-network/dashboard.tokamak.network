<template>
  <div class="operator-info-edit-layout">
    <form enctype="multipart/form-data">
      <div class="row container">
        <div class="column" style="margin-bottom: 72px;">
          <avatar style="margin-bottom: 8px;" fullname="O P R" :image="filteredImgURL(avatar)" :size="85" :color="operator.color" />
          <label class="custom-file-upload"><input type="file" accept="image/*" @change="onSelect">Change Photo</label>
        </div>
        <div class="column" style="margin-left: 60px;">
          <div class="row">
            <div class="column" style="margin-right: 24px;">
              <div class="title">Name</div>
              <input :value="name" style="width: 200px;" @input="updateName($event.target.value)">
            </div>
            <div class="column" style="flex: 1;">
              <div class="title">Website</div>
              <input :value="website" style="width: 200px;" @input="updateWebsite($event.target.value)">
            </div>
          </div>
          <div class="column" style="margin-top: 16px;">
            <div class="title">Description</div>
            <textarea :value="description" cols="40" rows="6" @input="updateDescription($event.target.value)" />
          </div>
          <div class="row" style="margin-top: 16px;">
            <div>Current commission rate: {{ operator.isCommissionRateNegative ? '-' : '' }}{{ operator.commissionRate | rateOf }}</div>
            <input :value="commissionRate" style="text-align: right; margin-left: 36px; width: 48px;" @input="updateCommissionRate($event.target.value)">
            %
            <div class="set-commission-rate-button">
              <base-button :label="'Set new commission rate'" :func="setNewCommissionRate" />
            </div>
          </div>
          <div class="row" style="margin-top: 16px;">
            <div>Current Withdrawal Delay: {{ operator.withdrawalDelay }}</div>
            <input :value="withdrawalDelay" style="text-align: right; margin-left: 31px; margin-right: 3px; width: 48px;" @input="updateWithdrawalDelay($event.target.value)">
            blocks
            <div class="set-commission-rate-button">
              <base-button :label="'Set new Withdrawal Delay'" :func="setNewWithdrawalDelay" />
            </div>
          </div>
          <div class="button-container"><base-button :label="'Update'" :func="update" /></div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { BN } from 'web3-utils';
import { getConfig } from '../../config.js';
import { updateOperator } from '@/api/index.js';
import { toChecksumAddress } from 'web3-utils';
import { recoverTypedSignatureLegacy } from 'eth-sig-util';

import { mapState, mapGetters } from 'vuex';
import BaseButton from '@/components/BaseButton.vue';
import Avatar from 'vue-avatar-component';

export default {
  components: {
    'avatar': Avatar,
    'base-button': BaseButton,
  },
  data () {
    return {
      from: '',
      selectedFile: {},
      operator: {},
      avatar: '',
      name: '',
      website: '',
      commissionRate: '',
      withdrawalDelay: '',
      description: '',
      preview: '',
    };
  },
  computed: {
    ...mapState([
      'user',
      'web3',
      'SeigManager',
      'DepositManager',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    filteredImgURL () {
      return name => {
        if (this.preview !== '') {
          return this.preview;
        }
        return name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
      };
    },
  },
  created () {
    this.operator = this.operatorByLayer2(this.$route.params.layer2);
    this.name = this.operator.name;
    this.website = this.operator.website;
    this.description = this.operator.description;
    this.avatar = this.operator.avatar;
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.from = from;
    });
  },
  methods: {
    onSelect (event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.preview = URL.createObjectURL(file);
      }
    },
    updateName (name) {
      this.name = name;
    },
    updateWebsite (website) {
      this.website = website;
    },
    updateDescription (description) {
      this.description = description;
    },
    updateCommissionRate (commissionRate) {
      this.commissionRate = commissionRate;
    },
    updateWithdrawalDelay (withdrawalDelay) {
      this.withdrawalDelay = withdrawalDelay;
    },
    setNewCommissionRate () {
      let isCommissionRateNegative;
      if (parseInt(this.commissionRate) < 0) {
        isCommissionRateNegative = true;
      } else {
        isCommissionRateNegative = false;
      }

      const base = '10000000000000000000000000'; // 1e25
      const commissionRate = (new BN(Math.abs(parseInt(this.commissionRate))).mul(new BN(base))).toString(); // (0 ~ 100) * 1e25

      this.SeigManager.methods.setCommissionRate(
        this.operator.layer2,
        commissionRate,
        isCommissionRateNegative,
      ).send({
        from: this.user,
      }).on('receipt', (receipt) => {
        if (receipt.status) {
          this.$notify({
            group: 'confirmed',
            title: 'Transaction is confirmed',
            type: 'success',
            duration: 10000,
          });
        } else {
          this.$notify({
            group: 'reverted',
            title: 'Transaction is reverted',
            type: 'error',
            duration: 10000,
          });
        }

        this.$router.replace({
          path: this.from.path,
          query: { network: this.$route.query.network },
        }).catch(err => {});
      });
    },
    setNewWithdrawalDelay () {
      this.DepositManager.methods.setWithdrawalDelay(
        this.operator.layer2,
        this.withdrawalDelay
      ).send({
        from:this.user,
      }).on('receipt', (receipt) => {
        if (receipt.status) {
          this.$notify({
            group: 'confirmed',
            title: 'Transaction is confirmed',
            type: 'success',
            duration: 10000,
          });
        } else {
          this.$notify({
            group: 'reverted',
            title: 'Transaction is reverted',
            type: 'error',
            duration: 10000,
          });
        }

        this.$router.replace({
          path: this.from.path,
          query: { network: this.$route.query.network },
        }).catch(err => {});
      });
    },
    async update () {
      if (this.name === '' || this.website === '' || this.description === '') {
        return alert('Please input all operator information');
      }
      try {
        await this.sign();
        await this.send();
        this.$router.replace({
          path: this.from.path,
          query: { network: this.$route.query.network },
        }).catch(err => {});
      } catch (err) {
        alert(err.message);
      }
    },
    async sign () {
      return new Promise((resolve, reject) => {
        const msgParams = [];
        if (this.selectedFile.name) msgParams.push({
          type: 'string',
          name: 'File name',
          value: this.selectedFile.name,
        });
        if (this.name !== '') msgParams.push({
          type: 'string',
          name: 'name',
          value: this.name,
        });
        if (this.website !== '') msgParams.push({
          type: 'string',
          name: 'website',
          value: this.website,
        });
        if (this.description !== '') msgParams.push({
          type: 'string',
          name: 'description',
          value: this.description,
        });

        /*  web3.eth.signTypedData not yet implemented!!!
         *  We're going to have to assemble the tx manually!
         *  This is what it would probably look like, though:
            web3.eth.signTypedData(msg, from) function (err, result) {
              if (err) return console.error(err)
              console.log('PERSONAL SIGNED:' + result)
            })
        */
        const params = [msgParams, this.user];
        const method = 'eth_signTypedData';

        this.web3.currentProvider.sendAsync({
          method,
          params,
          from: this.user,
        }, (err, result) => {
          if (err) return reject(err);
          if (result.error) {
            return reject(result.error.message);
          }

          const recovered = recoverTypedSignatureLegacy({ data: msgParams, sig: result.result });

          if (toChecksumAddress(recovered) === toChecksumAddress(this.user)) {
            resolve(true);
          } else {
            reject('Failed to verify signer when comparing ' + result + ' to ' + this.user);
          }
        });
      });
    },
    async send () {
      const formData = new FormData();

      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }
      formData.append('name', this.name);
      formData.append('website', this.website);
      formData.append('description', this.description);

      try {
        const operator = await updateOperator(this.operator.layer2, formData);
        this.$store.dispatch('updateOperator', operator);
      } catch (e) {
        //
      }
    },
  },
};
</script>

<style scoped>
.operator-info-edit-layout {
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  padding-top: 24px;
  padding-bottom: 24px;
}

form {
  width: 100%;
}

.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.title {
  font-family: "Noto Sans",sans-serif;
  font-size: 12px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
}

.container {
  align-items: center;
  justify-content: center;
}

button {
  cursor: pointer;
}

.button-container {
  color: #ffffff;
  background-color: #6fc4b3;
  border: 1px solid #6fc4b3;
  text-align: center;
  margin-top: 16px;
  font-size: 10px;
  margin-top: 24px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 6px;
}

.set-commission-rate-button {
  color: #ffffff;
  background-color: #f38776;
  border: 1px solid #f38776;
  margin-left: 8px;
  border-radius: 6px;
  padding-left: 2px;
  padding-right: 2px;
  font-size: 12px;
}

input[type="file"] {
  display: none;
}

input:focus {
  outline: none;
}

textarea:focus {
  outline: none;
}

label {
  font-family: "Noto Sans",sans-serif;
  font-size: 12px;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
  margin-top: 8px;
  text-align: center;
  border: 1px solid #ccc;
  display: inline-block;
  cursor: pointer;
}
</style>
