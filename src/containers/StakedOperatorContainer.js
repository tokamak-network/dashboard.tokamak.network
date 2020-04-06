
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.js';
import StakedOperatorTable from '../components/table/StakedOperatorTable.js';

export default {
  components: {
    'container-header': ContainerHeader,
    'staked-operator-table': StakedOperatorTable,
  },
};
