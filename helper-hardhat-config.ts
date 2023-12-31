type NetworkConfig = {
	[key: number]: {
		name: string;
		ethUsdPriceFeed: string;
		blockConfirmations: number;
	};
};

export const networkConfig: NetworkConfig = {
	11155111: {
		name: "sepolia",
		ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
		blockConfirmations: 3,
	},
	5: {
		name: "goerli",
		ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
		blockConfirmations: 4,
	},
	1: {
		name: "mainnet",
		ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
		blockConfirmations: 3,
	},
};

export const developmentChains = ["hardhat", "localhost"];
export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
