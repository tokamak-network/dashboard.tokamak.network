
import { mapState } from 'vuex';
import ContainerHeader from '@/containers/ContainerHeader.js';
import HistoryTable from '../components/table/HistoryTable.js';

export default {
  components: {
    'container-header': ContainerHeader,
    'history-table': HistoryTable,
  },
};
