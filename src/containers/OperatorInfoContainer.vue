<template>
  <div class="operator-info-container">
    <div class="row name-container">
      <avatar class="avatar" fullname="O P R" :image="filteredImgURL(operator.avatar)" :size="50" :color="operator.color" />
      <div class="name">{{ operator.name }}</div>
      <div class="space" style="flex: 1;" />
      <div class="row">
        <div v-if="user === operator.address" class="button">
          <base-button :label="'edit'" :func="edit" />
        </div>
        <div v-if="user === operator.address">
          <button class="button-commit" @click="commit">commit</button>
        </div>
      </div>
    </div>
    <text-viewer-link :title="'Website'"
                      :content="operator.website"
                      :with-divider="true"
                      :tooltip="'Website of the operator who runs the staking'"
                      :tooltipWidth="'240px'"
                      :tooltipMarginTop="'-6px'"
    />
    <text-viewer :title="'Description'"
                 :content="operator.description"
                 :with-divider="false"
                 :tooltip="'Introduction to the operator'"
                 :tooltipWidth="'180px'"
                 :tooltipMarginTop="'-9px'"
    />
    <!-- <text-viewer-downloader :title="'Genesis'"
                            :content="'Download'"
                            :href="exported(operator.genesis)"
                            :download="'genesis.json'"
                            :tooltip="'Information on Genesis Block of Operator’s Plasma Chain'"
                            :tooltipWidth="'280px'"
                            :tooltipMarginTop="'-6px'"
    /> -->
    <text-viewer-link :type="'address'"
                      :title="'Operator Address'"
                      :content="operator.address"
                      :with-divider="false"
                      :tooltip="'Account address of the operator'"
                      :tooltipMarginTop="'-6px'"
    />
    <text-viewer-link :type="'address'"
                      :title="'Operator Contract'"
                      :content="operator.layer2"
                      :with-divider="false"
                      :tooltip="'Smart Contract Address to manage the staking'"
                      :tooltipWidth="'260px'"
                      :tooltipMarginTop="'-6px'"
    />
    <text-viewer :title="'Chain ID'"
                 :content="operator.chainId"
                 :with-divider="false"
                 :tooltip="'Blockchain ID'"
                 :tooltipWidth="'160px'"
                 :tooltipMarginTop="'-9px'"
    />
    <text-viewer :title="'Commit Count'"
                 :content="operator.finalizeCount"
                 :with-divider="false"
                 :tooltip="'Number of a commit. Once the commit is made, the staking rewards and PowerTON Prize will be offered.'"
                 :tooltipWidth="'280px'"
                 :tooltipMarginTop="'-16px'"
    />
    <text-viewer :title="'Recent Commit'"
                 :content="fromNow(operator.lastFinalizedAt)"
                 :with-divider="false"
                 :tooltip="'This Operator\'s most recent commitment'"
                 :tooltipMarginTop="'-9px'"
    />
    <text-viewer :title="'Running Time'"
                 :content="fromNow(operator.deployedAt, true)"
                 :with-divider="false"
                 :tooltip="'Time in operation since the operator created the network'"
    />
    <text-viewer :title="'Commission Rate'"
                 :content="`${operator.isCommissionRateNegative ? '-' : ''}${rateOf(operator.commissionRate)}`"
                 :with-divider="false"
                 :tooltip="'The commission rate of this operator. It has a value between -100% and 100%.\n(1) + : The operator takes the profit from the delegator.\n(2) - : It distributes the operator\'s profits to the delegator.\n(3) 0 : It doesn’t divide the profit between the operator and the delegator.'"
                 :tooltipWidth="'300px'"
                 :tooltipMarginTop="'-41px'"
    />
    <text-viewer :title="'Reward'"
                 :content="currencyAmount(operator.userReward)"
                 :with-divider="false"
                 :tooltip="'Staking rewards from this Operator'"
                 :tooltipMarginTop="'-9px'"
    />
    <text-viewer :title="'Total Staked'"
                 :content="currencyAmount(operator.totalStaked)"
                 :with-divider="false"
                 :tooltip="'The amount of all TONs currently staked on this operator. It contains the staking rewards that have been created so far.'"
                 :tooltipWidth="'300px'"
                 :tooltipMarginTop="'-17px'"
    />
    <text-viewer :title="'My Staked'"
                 :content="currencyAmount(operator.userStaked)"
                 :with-divider="false"
                 :tooltip="'The amount of all my TONs currently staked on this operator. It includes the staking reward that I have received so far.'"
                 :tooltipWidth="'300px'"
                 :tooltipMarginTop="'-17px'"
    />
    <text-viewer :title="'Not Withdrawable'"
                 :content="currencyAmount(operator.userNotWithdrawable)"
                 :with-divider="false"
                 :tooltip="'Sum of your undelegate-stake reqeust amount. Each request does not withdrawable yet until 93046 blocks(14 days) passes from your request.'"
                 :tooltipWidth="'220px'"
                 :tooltipMarginTop="'-33px'"
    />
    <text-viewer :title="'Withdrawable'"
                 :content="currencyAmount(operator.userWithdrawable)"
                 :with-divider="false"
                 :tooltip="'Sum of all amount of undelegate-stake request which all passes 93046 blocks(14 days).'"
                 :tooltipWidth="'220px'"
    />
    <text-viewer :title="'New Commission Rate'"
                 :content="`${operator.delayedCommissionRateNegative ? '-' : ''}${rateOf(operator.delayedCommissionRate)}`"
                 :with-divider="false"
                 :tooltip="'Changed commission rate (New Commission Rate Changed At - current block height) blocks later'"
                 :tooltipWidth="'220px'"
    />
    <text-viewer :title="'New Commission Rate Changed At'"
                 :content="operator.delayedCommissionBlock"
                 :with-divider="false"
                 :tooltip="'Block height when the new commission rate is applied.'"
                 :tooltipWidth="'220px'"
    />
    <text-viewer :title="'Withdrawal Delay'"
                 :content="`${delay()}${' blocks'}`"
                 :with-divider="false"
                 :tooltip="'Withdrawal delay in order to withdraw your fund. There are global and local delay, and the greater value is applied. While your withdrawal request processing, the rewards for the requested amount is not given.'"
                 :tooltipWidth="'220px'"
    />
  </div>
</template>

<script>
import { getConfig } from '../../config.js';
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import Layer2ABI from '@/contracts/abi/Layer2.json';
import { createWeb3Contract } from '@/helpers/Contract';
import { BN } from 'web3-utils';

import { mapState, mapGetters } from 'vuex';
import Avatar from 'vue-avatar-component';
import TextViewer from '@/components/TextViewer.vue';
import TextViewerLink from '@/components/TextViewerLink.vue';
import TextViewerDownloader from '@/components/TextViewerDownloader.vue';
import BaseButton from '@/components/BaseButton.vue';

export default {
  components: {
    'avatar': Avatar,
    'text-viewer': TextViewer,
    'text-viewer-link': TextViewerLink,
    // 'text-viewer-downloader': TextViewerDownloader,
    'base-button': BaseButton,
  },
  props: {
    layer2: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapState([
      'user',
      'DepositManager',
    ]),
    ...mapGetters([
      'operatorByLayer2',
    ]),
    operator () {
      return this.operatorByLayer2(this.layer2);
    },
    filteredImgURL () {
      return name => name !== '' ? `${getConfig().baseURL}/avatars/${name}` : '';
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    fromNow () {
      return (timestamp, suffix = false) => this.$options.filters.fromNow(timestamp, suffix);
    },
    rateOf () {
      return commissionRate => this.$options.filters.rateOf(commissionRate);
    },
    exported () {
      return genesis => 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(genesis, undefined, 2));
    },
  },
  created () {
    this.delay();
  },
  methods: {
    edit () {
      const path = this.$route.path;
      this.$router.push({
        path: `${path}/edit`,
        query: { network: this.$route.query.network },
      }).catch(err => {});
    },
    delay () {
      const operatorDelay = this.operator.withdrawalDelay;
      const globalDelay = this.operator.globalWithdrawalDelay;
      if(operatorDelay > globalDelay) {
        return Number(operatorDelay);
      }
      else {
        return Number(globalDelay);
      }
    },
    // only for mton version.
    async commit () {
      const Layer2 = createWeb3Contract(Layer2ABI, this.operator.layer2);
      const [
        costNRB,
        NRELength,
        currentForkNumber,
      ] = await Promise.all([
        Layer2.methods.COST_NRB().call(),
        Layer2.methods.NRELength().call(),
        Layer2.methods.currentFork().call(),
      ]);

      const fork = await Layer2.methods.forks(currentForkNumber).call();
      const epochNumber = parseInt(fork.lastEpoch) + 1;
      const startBlockNumber = parseInt(fork.lastBlock) + 1;
      const endBlockNumber = parseInt(startBlockNumber) + parseInt(NRELength) - 1;

      // pos1 = fork number * 2^128 + epoch number
      // pos2 = start block number * 2^128 + end block number
      const pos1 = this._makePos(currentForkNumber, epochNumber);
      const pos2 = this._makePos(startBlockNumber, endBlockNumber);
      const dummyBytes = '0xdb431b544b2f5468e3f771d7843d9c5df3b4edcf8bc1c599f18f0b4ea8709bc3';

      Layer2.methods.submitNRE(
        pos1,
        pos2,
        dummyBytes, // epochStateRoot
        dummyBytes, // epochTransactionsRoot
        dummyBytes, // epochReceiptsRoot
      ).send({
        from: this.operator.address,
        value: costNRB,
      }).on('transactionHash', async (hash) => {
        const transcation = {
          from: this.user,
          type: 'Commit',
          transactionHash: hash,
          target: this.operator.layer2,
          amount: 0,
        };
        this.$store.dispatch('addPendingTransaction', transcation);
      })
        .on('receipt', (receipt) => {
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
        });
    },
    _makePos (v1, v2) {
      v1 = new BN(v1);
      v2 = new BN(v2);

      const a = v1.mul(new BN(2).pow(new BN(128)));
      return a.add(v2).toString();
    },
  },
};
</script>

<style scoped>
.operator-info-container {
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: solid 1px #ced6d9;
  background-color: #ffffff;
}

.name-container {
  padding-top: 12px;
  padding-bottom: 12px;
  margin-left: 16px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.name {
  width: 200px;
  padding-left: 16px;
  padding-right: 8px;
  font-family: "Noto Sans",sans-serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #161819;
  word-break: break-all;
}

.button {
  color: #ffffff;
  background-color: #35496b;
  border: 1px solid #35496b;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  height: 22px;
  width: 40px;
  margin-right: 16px;
}

.button-commit {
  color: #ffffff;
  background-color: #f38776;
  border: 1px solid #f38776;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  height: 24px;
  margin-right: 16px;
}

.button-commit:hover {
  cursor: pointer;
}
</style>
