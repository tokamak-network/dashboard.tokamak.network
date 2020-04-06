
import config from '../../config.json';
import moment from 'moment';
import { createCurrency } from '@makerdao/currency';
const _TON = createCurrency('TON');

import { mapState } from 'vuex';
import Avatar from 'vue-avatar-component';
import TextViewer from '@/components/TextViewer.js';
import TextViewerLink from '@/components/TextViewerLink.js';
import TextViewerDownloader from '@/components/TextViewerDownloader.js';
import BaseButton from '@/components/BaseButton.js';

export default {
  components: {
    'avatar': Avatar,
    'text-viewer': TextViewer,
    'text-viewer-link': TextViewerLink,
    'text-viewer-downloader': TextViewerDownloader,
    'base-button': BaseButton,
  },
  props: {
    operator: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapState([
      'user',
    ]),
    filteredImgURL () {
      return name => name !== '' ? `${config.baseURL}/avatars/${name}` : '';
    },
    currencyAmount () {
      return amount => this.$options.filters.currencyAmount(amount);
    },
    duration () {
      return timestamp => moment.unix(timestamp).fromNow();
    },
    exported () {
      return genesis => 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(genesis, undefined, 2));
    },
    formatedTimestamp () {
      return timestamp => moment.unix(timestamp).format('LLL');
    },
  },
  methods: {
    edit () {
      const path = this.$route.path;
      this.$router.push(`${path}/edit`);
    },
  },
};
