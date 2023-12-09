import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

const deployFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, log, get } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId || 11155111;

	let ethUsdPriceFeedAddress;
	// ! if on dev chain -> get mock address, ELSE get from network
	if (developmentChains.includes(network.name)) {
		const ethUsdAggregator = await get("MockV3Aggregator");
		ethUsdPriceFeedAddress = ethUsdAggregator.address;
	} else {
		ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
	}

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [ethUsdPriceFeedAddress], // put price feed address
		log: true,
	});

	log("===================================================================");
};
export default deployFunc;
deployFunc.tags = ["all", "fundMe"];
