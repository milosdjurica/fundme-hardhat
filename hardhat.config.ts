import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import "hardhat-deploy";

// * CONSTANTS
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

// * CONFIG
const config: HardhatUserConfig = {
	solidity: {
		compilers: [{ version: "0.8.20" }, { version: "0.6.6" }],
	},
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
			// gasPrice: 130000000000,
		},
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 11155111,
		},
		goerli: {
			url: GOERLI_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 5,
		},
	},
	gasReporter: {
		enabled: false,
		currency: "USD",
		excludeContracts: [],
		src: "./contracts",
		outputFile: "gas-report.txt",
		noColors: true,
		coinmarketcap: COINMARKETCAP_API_KEY,
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	namedAccounts: {
		deployer: {
			default: 0,
			// chainId : accountNumber
			// 1: 0,
			// 31337: 3,
		},
		user: {
			default: 1,
		},
	},
};

export default config;
