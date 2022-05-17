import InputDataDecoder from 'ethereum-input-data-decoder';

import TONABI from '@/contracts/abi/TON.json';
import WTONABI from '@/contracts/abi/WTON.json';
import DepositManagerABI from '@/contracts/abi/DepositManager.json';
import SeigManagerABI from '@/contracts/abi/SeigManager.json';
import Layer2ABI from '@/contracts/abi/Layer2.json';

export function decoder (tx) {
  const decoder = new InputDataDecoder(TONABI);
  const result = decoder.decodeData(tx.data);

  console.log(result.inputs[1]);
  console.log(result.inputs[2]);
  console.log(result.inputs[1].toString());
  const a = new TextEncoder().encode(result.inputs[2]);
  console.log( String.fromCharCode.apply(null, result.inputs[2]));
}
