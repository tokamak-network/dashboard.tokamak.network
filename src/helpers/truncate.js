import Web3 from 'web3';

export const truncateAddress = (address, chars = 4) => Web3.utils.isAddress(address) && `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
