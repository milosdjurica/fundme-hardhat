import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
};
export default deployFunc;
