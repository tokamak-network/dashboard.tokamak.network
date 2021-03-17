import {
  LEDGER,
  TREZOR,
} from './walletTypes';

import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';

export default {
  [LEDGER]: ledgerPaths,
  [TREZOR]: trezorPaths,
};
