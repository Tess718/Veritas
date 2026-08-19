import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DEFAULT_NETWORK = process.env.VITE_NETWORK;

export default {
  defaultNetwork: DEFAULT_NETWORK === "mainnet" ? "botchain_mainnet" : "botchain_testnet",
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    botchain_testnet: {
      url: "https://rpc.bohr.life",
      chainId: 968,
      accounts: [PRIVATE_KEY],
    },
    botchain_mainnet: {
      url: "https://rpc.botchain.ai",
      chainId: 677,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      botchain_testnet: "blockscout",
      botchain_mainnet: "blockscout",
    },
    customChains: [
      {
        network: "botchain_testnet",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
      {
        network: "botchain_mainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
};
