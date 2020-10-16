<template>
  <div class="edit-container">
    <button class="cancel-button" @click="cancel(false)">X</button>
    <div class="avatar-row">
      <avatar style="margin-bottom: 8px;" fullname="O P R" :image="filteredImgURL(avatar)" :size="65" :color="operator.color" />
      <label class="custom-file-upload">
        <input type="file" accept="image/*" @change="onSelect">Change Photo</label>
    </div>
    <div class="name-row">
      <div class="text">Name</div>
      <div class="input-text">
        <input :value="name" class="value-input" autocomplete="off" @input="updateName($event.target.value)">
      </div>
    </div>
    <div class="name-row">
      <div class="text">Website</div>
      <div class="input-text">
        <input :value="website" class="value-input" autocomplete="off" @input="updateWebsite($event.target.value)">
      </div>
    </div>
    <div class="name-row" style="flex-direction:column; align-items: flex-start; height:80px; padding-bottom:10px">
      <div class="text">Description</div>
      <textarea class="description" :value="description" cols="40" rows="6" style="text-align:inherit; width:400px" @input="updateDescription($event.target.value)" />
    </div>
    <button class="set-button" @click="update()">Update</button>

    <div class="name-row">
      <div class="text">Commission Rate</div>
      <div class="input-text">
        <input :value="operator.commissionRate | rateOf " class="value-input" autocomplete="off" @input="updateWebsite($event.target.value)">
      </div>
    </div>
    <button class="set-button" @click="setNewCommissionRate()">Set new commission rate</button>
    <div class="name-row">
      <div class="text">Current Withdrawal Delay</div>
      <div class="input-text">
        <input :value="withdrawalDelay" class="value-input" autocomplete="off" @input="updateWebsite($event.target.value)">
      </div>
    </div>
    <button class="set-button" @click="setNewCommissionRate()">Set new withdrawal delay</button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { createCurrency } from '@makerdao/currency';
import { getConfig } from '../../config.js';
import Avatar from 'vue-avatar-component';
import { BN } from 'web3-utils';

import { updateOperator } from '@/api/index.js';
import { toChecksumAddress } from 'web3-utils';
import { recoverTypedSignatureLegacy } from 'eth-sig-util';

export default {
  components: {
    'avatar': Avatar,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
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
      'tonBalance',
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
    this.operator = this.operatorByLayer2(this.layer2);
    this.name = this.operator.name;
    this.website = this.operator.website;
    this.description = this.operator.description;
    this.avatar = this.operator.avatar;
    this.commissionRate = this.operator.commissionRate;
    this.withdrawalDelay = this.operator.withdrawalDelay;
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.from = from;
    });
  },
  methods: {
    cancel (visibility) {
      this.$emit('showEditContainer', visibility);
    },
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
.edit-container {
    background-color:white;
    width: 460px;
    height: 570px;
    display: flex;
    border-radius: 12px;
    align-items: center;
    flex-direction: column;
    padding: 20px;
}
.cancel-button {
    border: none;
    background-color: white;
}
.avatar-row {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.camera {
    height: 30px;
    width: 30px;
    margin-left: -24px;
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
input[type="file"] {
  display: none;
}

input:focus {
  outline: none;
}
.name-row {
    background-color: #f6f8f9;
    width: 90%;
    border-radius: 12px;
    padding: 0px 15px;
    margin: 15px 5px 0px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 14px;
}
.input-text {
    display: flex;
    flex-direction: row;
}
.value-input {
    text-align: right;
  height: 20px;
  border: none;
  background-color:#f6f8f9;
  font-size: 14px;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
    margin-right: 20px;
    align-items: center;
     color: #555555;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
input:focus {
  outline: none;
}
input:hover {
  outline: none;
}
textarea:focus {
  outline: none;
}
.description {
    border: none;
    background-color:#f6f8f9;
    font-family: "Noto Sans",sans-serif;
     color: #555555;
}
.set-button {
   margin-top: 10px;
   height: 30px;
   color: #2a72e5;
   font-weight: 700;
  display: flex;
  justify-content: flex-end;
  align-items: center;
   background-color:#f6f8f9;
   border: none;
     box-shadow: inset 1px 1px 0px #e2e8eb;
     border: solid 1px;
  border-color: #ccd1d3;
  border-radius: 12px;
}
button:focus {
  outline: none;
}
</style>
