import { ETH } from '@/networks/types';

import {
  ledgerEthereum,
  ledgerLiveEthereum,
} from '../../bip44/paths';

const appList = [
  {
    network: ETH,
    prefixes: ['m/44\'/60\''],
    paths: [ledgerEthereum, ledgerLiveEthereum],
  },
];
export default appList;
