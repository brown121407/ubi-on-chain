import ethers from "ethers";
import env from "./environments/index.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const UBI = require("../contracts/artifacts/contracts/UBI.sol/UBI.json");

const { networks } = env;

const contracts = networks.map((network) => {
    const provider = new ethers.providers.JsonRpcProvider(network.url);
    return new ethers.Contract(network.contractAddress, UBI.abi, provider);
});

const networkIdx = 0;

const provider = new ethers.providers.JsonRpcProvider(networks[networkIdx].url);
const signer = new ethers.Wallet("0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", provider);
await contracts[networkIdx].connect(signer).subscribe();



// DONATE
// for (let i = 0; i < networks.length; i++) {
//     const provider = new ethers.providers.JsonRpcProvider(networks[i].url);
//     const signer = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", provider);
//     await contracts[i].connect(signer).donate({value: ethers.utils.parseEther("1")});
// }

