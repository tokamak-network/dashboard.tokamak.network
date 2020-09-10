<template>
  <div>
    <div class="delegate-layout">
      <div class="row">
        <container-header :title="'Delegate'" />
        <div class="select-option"> Select Operator:
        <select v-model="selectedOperator" class="unit-select" @change="onChange($event)">
          <option v-for="(operator, index) in operators" :key="index" :value="operator.name">{{ operator.name }}</option>
        </select>
        </div>
      </div>
    </div>
    <div class="second-row">
      <operator-info-container
        class="left-container"
        :layer2="layer2"
      />
      <delegate-manager-container
        class="right-container"
        :layer2="layer2"
      />
    </div>
  </div>
</template>

<script>
import ContainerHeader from '@/containers/ContainerHeader.vue';
import { mapState } from 'vuex';
import DelegateManagerContainer from '@/containers/DelegateManagerContainer.vue';
import OperatorInfoContainer from '@/containers/OperatorInfoContainer.vue';

export default {
  components: {
    'container-header': ContainerHeader,
    'operator-info-container': OperatorInfoContainer,
    'delegate-manager-container': DelegateManagerContainer,
  },
  data () {
    return {
      layer2: '',
      selectedOperator: '',
    };
  },
  computed: {
    ...mapState([
      'operators',
    ]),
  },
  created () {
    this.selectedOperator = this.operators[0].name;
    this.layer2 = this.operators[0].layer2;
  },
  methods :{
    onChange (event) {
      const operator =  this.operators.find(operator => operator.name === event.target.value);
      const root = operator.layer2;
      this.layer2 = root;
    },
  },
};
</script>

<style scoped>
.delegate-layout {
  border: solid 1px #ced6d9;
  background-color: #ffffff;
  border-radius: 6px;
}
.row {
  min-width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.second-row {
min-width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 5px;
}

.left-container {
  flex: 5;
  margin-right: 4px;
}

.right-container {
  flex: 3;
  margin-left: 4px;
}

.unit-select {
  width: 150px;
   margin-left: 10px;
   margin-right: 20px;
}

select {
  width: 100%;
  border-radius: 4px;
  border: 1px #f1f1f1;
  height: 30px;
  font-weight: solid;
}
select:focus {
  outline: none;
}
.select-option {
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  margin-bottom: 4px;
  color: #124b71;
}
</style>
