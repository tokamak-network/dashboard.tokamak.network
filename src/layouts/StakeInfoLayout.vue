<template>
  <div>
    <div class="operator-list-layout">
      <div
        style="flex: 1;
      border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
  margin-right: 8px;"
      >
        <div style="padding: 16px; display: flex; flex-direction: column; height: 100%;">
          <div style="display: flex;">
            <div style="flex: 1; font-size: 19px; color: #000000">
              Total Reward
            </div>
            <div style="font-size: 19px; color: #000000">
              {{ userTotalReward | convertToTON }}
            </div>
          </div>
          <div class="divider" />
          <div style="display: flex; margin-top: 60px;">
            <div style="flex: 1; font-size: 14px; color: #586064;">
              Total Deposit
            </div>
            <div style="font-size: 14px; color: #586064">
              {{ userTotalDeposit | convertToTON }}
            </div>
          </div>
          <div style="display: flex; margin-top: 8px;">
            <div style="flex: 1; font-size: 14px; color: #586064">
              Total Stake
            </div>
            <div style="font-size: 14px; color: #586064">
              {{ userTotalStake | convertToTON }}
            </div>
          </div>
          <div style="display: flex; margin-top: 8px;">
            <div style="flex: 1; font-size: 14px; color: #586064">
              Total Pending
            </div>
            <div style="font-size: 14px; color: #586064">
              {{ userTotalPending | convertToTON }}
            </div>
          </div>
          <div style="display: flex; margin-top: 8px;">
            <div style="flex: 1; font-size: 14px; color: #586064">
              My Operators
            </div>
            <div style="font-size: 14px; color: #586064">
              {{ operatorsStaked.length }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="table-container"
        style="flex: 1;
        border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
        "
      >
        <standard-table
          :type="'operator'"
          :columns="[
            {
              name: 'OPERATOR',
              key: 'registry.name',
            },
            {
              name: 'MY STAKE',
              key: 'userStake',
            },
          ]"
          :datas="operatorsStaked"
          :rounded="true"
          :clickable="true"
          @tableDataClicked="viewOperator"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import StandardTable from '@/components/StandardTable.vue';

export default {
  components: {
    'standard-table': StandardTable,
  },
  data () {
    return {
      columns: [],
      searching: false,
      operatorsBySearching: [],
    };
  },
  computed: {
    ...mapState([
      'tonBalance',
    ]),
    ...mapGetters([
      'operatorsStaked',
      'userTotalDeposit',
      'userTotalStake',
      'userTotalReward',
      'userTotalPending',
    ]),
  },
  methods: {
    viewOperator (operator) {
      const rootchain = operator.rootchain;
      this.$router.push(`/operators/${rootchain.toLowerCase()}`);
    },
    searchOperatorByName (name) {
      if (name === '') {
        this.searching = false;
      } else {
        this.searching = true;
        this.operatorsByName =
          this.operators.filter(operator => operator.name.toLowerCase().includes(name.toLowerCase()));
      }
    },
  },
};
</script>

<style scoped>
.operator-list-layout {
  display: flex;
}

.divider{
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
  height: 1px;
  background: #b4b4b4;
}
</style>
