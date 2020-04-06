
import config from '../../config.json';
import { updateOperator } from '@/api/index.js';
import { toChecksumAddress } from 'web3-utils';
import { recoverTypedSignatureLegacy } from 'eth-sig-util';

import { mapState, mapGetters } from 'vuex';
import BaseButton from '@/components/BaseButton.js';
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
      description: '',
      preview: '',
    };
  },
  computed: {
    ...mapState([
      'user',
      'web3',
    ]),
    ...mapGetters([
      'operatorByRootChain',
    ]),
    filteredImgURL () {
      return name => {
        if (this.preview !== '') {
          return this.preview;
        }
        return name !== '' ? `${config.baseURL}/avatars/${name}` : '';
      };
    },
  },
  created () {
    this.operator = this.operatorByRootChain(this.$route.params.rootchain);
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
    async update () {
      if (this.name === '' || this.website === '' || this.description === '') {
        return alert('Please input all operator information');
      }
      try {
        await this.sign();
        await this.send();
        this.$router.replace(this.from);

        await this.$store.dispatch('set');
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
        const operator = await updateOperator(this.operator.rootchain, formData);
        this.$store.dispatch('updateOperator', operator);
      } catch (e) {
        //
      }
    },
  },
};
