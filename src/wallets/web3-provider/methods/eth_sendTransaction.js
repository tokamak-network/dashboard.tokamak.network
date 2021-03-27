import unit from 'ethjs-unit';
import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import { WEB3_WALLET, WALLET_CONNECT } from '../../bip44/walletTypes';
import EventNames from '../events';
import { toPayload } from '../jsonrpc';
import * as locStore from 'store';
import { getSanitizedTx } from './utils';
import BigNumber from 'bignumber.js';
import { Misc } from '@/helpers';

const setEvents = (promiObj, tx, dispatch) => {
  promiObj
    .once('transactionHash', hash => {
      dispatch('addNotification', ['Hash', tx.from, tx, hash]);
    })
    .once('receipt', res => {
      dispatch('addNotification', ['Receipt', tx.from, tx, res]);
    })
    .on('error', err => {
      dispatch('addNotification', ['Error', tx.from, tx, err]);
    });
};
export default async (
  { payload, store, requestManager, eventHub },
  res,
  next
) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  const gasPrice = await store.state.web3.eth.getGasPrice();
  tx.gasPrice = unit.toWei(gasPrice, 'gwei').toString();
  tx.gasPrice = gasPrice;
  const localTx = Object.assign({}, tx);
  delete localTx.gas;
  delete localTx.nonce;
  const ethCalls = new EthCalls(requestManager);
  try {
    tx.nonce = !tx.nonce
      ? await store.state.web3.eth.getTransactionCount(
        store.state.wallet.getAddressString()
      )
      : tx.nonce;
    tx.gas = !tx.gas ? await ethCalls.estimateGas(localTx) : tx.gas;
  } catch (e) {
    res(e);
    return;
  }
  tx.chainId = 4;
  getSanitizedTx(tx)
    .then(async (_tx) => {
      if (
        store.state.wallet.identifier === WEB3_WALLET ||
        store.state.wallet.identifier === WALLET_CONNECT
      ) {
        eventHub.$emit(EventNames.SHOW_WEB3_CONFIRM_MODAL, _tx, _promiObj => {
          setEvents(_promiObj, _tx, store.dispatch);
          _promiObj
            .once('transactionHash', hash => {
              res(null, toPayload(payload.id, hash));
            })
            .on('error', err => {
              res(err);
            });
        });
      } else {
        const signPromise = await store.state.wallet.signTransaction(_tx);
        const _promiObj = store.state.web3Instance.eth.sendSignedTransaction(
          signPromise.rawTransaction
        );
        _promiObj.once('transactionHash', async (hash) => {
          if (store.state.wallet !== null) {
            console.log(hash);
            // const transcation = {
            //   from: store.state.user,
            //   type: 'Delegated',
            //   amount: amount,
            //   transactionHash: hash,
            //   target: store.state.operator.layer2,
            // };
            // store.dispatch('addPendingTransaction', transcation);
          }
          // res(null, toPayload(payload.id, hash));
        }).on('error', err => {
          alert(err);
        });
        // setEvents(_promiObj, _tx, store.dispatch);
      }
    })
    .catch(e => {
      alert(e);
    });
};
