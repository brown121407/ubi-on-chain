import React from "react";
import { ethers } from "ethers";
import UBI from '../contracts/UBI.json';

export const networks = [
  {
    name: 'Rinkeby',
    coin: 'ETH',
    sum: 0.001,
    chainId: '0x4',
    contractAddress: '0xC76920bEE436767698E7EB54E4Faa5c337898ADD',
  },
  {
    name: 'Mumbai',
    coin: 'MATIC',
    sum: 0.005,
    chainId: '',
    contractAddress: '0x76264875Ae9992098E4A5aa6492D5c8cDBf1109B',
  },
  {
    name: 'bsct',
    coin: 'TBSC',
    sum: 0.002,
    chainId: '',
    contractAddress: '0x871Ae0DAC50759357B97fcA2810bF8B281aB507B',
  },
];

export const UBIContext = React.createContext({ contracts: [] });

const UBIContextProvider = ({ children }) => {
  const context = { networks }

  if (window.ethereum) {
    context.metamask = window.ethereum;
    context.provider = new ethers.providers.Web3Provider(context.metamask);
    // TODO: nu mai fi bou
    const network = networks.filter(x => x.chainId === window.ethereum.chainId)[0];
    context.contract = new ethers.Contract(network.contractAddress, UBI.abi, context.provider.getSigner());
 }

  return (
    <UBIContext.Provider value={context}>
      { children }
    </UBIContext.Provider>
  )
}

export default UBIContextProvider;