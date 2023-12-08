import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "hardhat-deploy";

const config: HardhatUserConfig = {
	solidity: "0.8.20",
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
