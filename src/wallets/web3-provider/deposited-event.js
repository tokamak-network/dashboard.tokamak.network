const fs = require('fs');
const Web3 = require('web3');
const InputDataDecoder = require('ethereum-input-data-decoder');
const TONABI = require('../../contracts/abi/TON.json');
const rawdata = fs.readFileSync('./data.json');
const data = JSON.parse(rawdata);
const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.tokamak.network'));

async function formatData () {
  const decoder = new InputDataDecoder(TONABI);
  for (const tx of data.datas) {
    const receipt = await web3.eth.getTransactionReceipt(tx.txInfo.hash);
    const transaction = await web3.eth.getTransaction(tx.txInfo.hash);

    const used = receipt.gasUsed * transaction.gasPrice;
    const result = decoder.decodeData(transaction.input);

    if (typeof result.inputs[1] !== 'undefined') {
      if (Number(result.inputs[1].toString()) >= 50000000000000000000) {
        console.log(tx.from, tx.txInfo.hash, web3.utils.fromWei(used.toString(), 'ether'), ',', web3.utils.fromWei(result.inputs[1].toString(), 'ether'));
      }
    }
  }
}

formatData();
// 0x8925b0334bf16eb367c3f2dbfcb791734f1c1c2182597344cc3243d8f8f8fecb
// 0x64963edf5b304ea2132e1f519bed70f54bdf5ea2e1cfe049a484565a3476d14c
// 0xcde483052ff7c5e72674987f9ede588e290037a91dd918b97f3f4cb4cc4caff2
// 0xdccca090f04fdaa91a86e424629fb4fde6686e353dd1dc0a88ca1186f028826c
// 0x1fed8900baa16e417dd366d6bf68e3ced3c95e580ab18b2a05df0f8035eb10ad

//0x6080034cbd187d2e730fe91bca7ea0a29d8fa6b2314fae707b1cd9e66fc6b855
// 0x4621caae32af18f2656852f15292a0919aa6b82f92ea2ea1e870b54b3498aef1
// 0x8478c4fbd763e265dab98f4551cfae3e886a32944000320f5c15eb23dfe8e9eb
// 0x850cf714468c9d438c685e6651cc1d8d3d1636998df2f92087dc956fa0418afc
// 0x3bb0ac6f4bc3b1da84b8ca28b497ec0797c5c0e3aac616eba4b659673b229899
