import Common from 'ethereumjs-common';

const commonGenerator = network => {
  const customCommon = Common.forCustomChain('mainnet', {
    name: 'Rinkeby',
    chainId: 4,
  });
  return new Common(customCommon._chainParams, 'petersburg', ['petersburg']);
};

export default commonGenerator;
