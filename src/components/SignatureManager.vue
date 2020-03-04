<template>
  <div>
    <button @click="sign">
      sign
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { toChecksumAddress } from 'web3-utils';
import { recoverTypedSignatureLegacy } from 'eth-sig-util';

export default {
  computed: mapState([
    'web3',
    'user',
  ]),
  methods: {
    sign () {
      const msgParams = [
        {
          type: 'string',
          name: 'Message',
          value: 'Hi, Alice!',
        },
        {
          type: 'uint32',
          name: 'A number',
          value: '1337',
        },
      ];

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
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error(result);
        console.log('PERSONAL SIGNED:' + JSON.stringify(result.result));

        const recovered = recoverTypedSignatureLegacy({ data: msgParams, sig: result.result });

        if (toChecksumAddress(recovered) === toChecksumAddress(this.user)) {
          alert('Successfully ecRecovered signer as ' + this.user);
        } else {
          alert('Failed to verify signer when comparing ' + result + ' to ' + this.user);
        }
      });
    },
  },
};
</script>

<style scoped>
</style>
