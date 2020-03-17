<template>
  <form enctype="multipart/form-data">
    <div class="column container">
      <image-upload v-model="avatar" :before-avatar="operator.avatar" />
      <operator-info-input v-model="name" :label="'NAME'" />
      <operator-info-input v-model="website" :label="'WEBSITE'" />
      <operator-info-input v-model="description" :label="'DESCRIPTION'" />
      <div class="button"><base-button :label="'UPDATE'" :func="update" /></div>
    </div>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { updateOperator } from '@/api/index.js';
import { toChecksumAddress } from 'web3-utils';
import { recoverTypedSignatureLegacy } from 'eth-sig-util';

import ImageUpload from '@/components/ImageUpload.vue';
import OperatorInfoInput from '@/components/OperatorInfoInput.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  components: {
    'image-upload': ImageUpload,
    'operator-info-input': OperatorInfoInput,
    'base-button': BaseButton,
  },
  data () {
    return {
      from: '',
      operator: {},
      avatar: undefined,
      name: '',
      website: '',
      description: '',
    };
  },
  computed: {
    ...mapState([
      'user',
      'web3',
    ]),
    ...mapGetters([
      'operatorByRootchain',
    ]),
  },
  created () {
    this.operator = this.operatorByRootchain(this.$route.params.rootchain);
    this.name = this.operator.name;
    this.website = this.operator.website;
    this.description = this.operator.description;
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.from = from;
    });
  },
  methods: {
    async update () {
      try {
        if (await this.sign()){
          await this.send();
        }
        await this.$store.dispatch('set');
        this.$router.replace(this.from);
      } catch (err) {
        alert(err.message);
      }
    },
    async sign () {
      return new Promise((resolve, reject) => {
        const msgParams = [];
        if (this.avatar) msgParams.push({
          type: 'string',
          name: 'File name',
          value: this.avatar.name,
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

      if (this.avatar) {
        formData.append('avatar', this.avatar);
      }
      formData.append('name', this.name);
      formData.append('website', this.website);
      formData.append('description', this.description);

      try {
        await updateOperator(this.operator.rootchain, formData);
      } catch (e) {
        //
      }
    },
  },
};
</script>

<style scoped>
form {
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
}

.container {
  align-items: center;
  border-radius: 6px;
  border: solid 0.7px #ced6d9;
  background-color: #ffffff;
  padding: 20px;
}

.button {
  color: #ffffff;
  background-color: #6fc4b3;
  border: 1px solid #6fc4b3;
  text-align: center;
  width: 100%;
  font-size: 14px;
  line-height: 2.5;
  border-radius: 4px;
}
</style>
