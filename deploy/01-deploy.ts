import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { networkConfig } from "../helper-hardhat-config";

const deployFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId || 11155111;

	const ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [], // put price feed address
		log: true,
	});
};
export default deployFunc;
