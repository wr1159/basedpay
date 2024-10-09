import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/deploy-contracts";

require("dotenv").config();

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.23",
            },
            {
                version: "0.7.6",
            },
            {
                version: "0.4.22",
            },
        ],
    },
    networks: {
        hardhat: {
            forking: {
                url: "https://sepolia.base.org",
            },
        },
        // for mainnet
        "base-mainnet": {
            url: "https://mainnet.base.org",
            accounts: [process.env.WALLET_KEY as string],
            gasPrice: 1000000000,
        },
        // for testnet
        "base-sepolia": {
            url: "https://sepolia.base.org",
            accounts: [process.env.WALLET_KEY as string],
            gasPrice: 1000000000,
        },
        // for local dev environment
        "base-local": {
            url: "http://localhost:8545",
            accounts: [process.env.WALLET_KEY as string],
            gasPrice: 1000000000,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // Default is the first account
            mainnet: 0,
        },
        owner: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
    defaultNetwork: "hardhat",
};

export default config;
