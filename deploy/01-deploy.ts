import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deployFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, log, get } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId || 11155111;
	const isDevelopmentChain = developmentChains.includes(network.name);
	let ethUsdPriceFeedAddress;

	// ! if on dev chain -> get mock address, ELSE get from network
	if (isDevelopmentChain) {
		const ethUsdAggregator = await get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	} else {
		ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
	}

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [ethUsdPriceFeedAddress], // put price feed address
		log: true,
		waitConfirmations: isDevelopmentChain
			? 1
			: networkConfig[chainId].blockConfirmations,
	});

	if (!isDevelopmentChain && process.env.ETHERSCAN_API_KEY) {
		await verify(fundMe.address, [ethUsdPriceFeedAddress]);
	}

	log("===================================================================");
};
export default deployFunc;
deployFunc.tags = ["all", "fundMe"];
