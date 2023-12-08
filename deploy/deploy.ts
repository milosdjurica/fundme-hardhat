import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

const deployFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [], // put price feed address
		log: true,
	});
};
export default deployFunc;
