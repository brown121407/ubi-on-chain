require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("deploy", "Deploy UBI contract")
  .addParam("backend", "The backend's wallet address")
  .addParam("dailyIncome", "How much to distribute daily to subscribers")
  .setAction(async (taskArgs) => {
    const ubiFactory = await hre.ethers.getContractFactory("UBI");
    const ubi = await ubiFactory.deploy(taskArgs.backend, hre.ethers.utils.parseEther(taskArgs.dailyIncome));

    await ubi.deployed();

    console.log("UBI deployed to:", ubi.address);
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    localhost1: {
      url: "http://127.0.0.1:8545"
    },
    localhost2: {
      url: "http://127.0.0.1:8546"
    },
    localhost3: {
      url: "http://127.0.0.1:8547"
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsct: {
      url: process.env.BSCT_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
