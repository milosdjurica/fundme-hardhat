import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
	DECIMALS,
	INITIAL_ANSWER,
	developmentChains,
} from "../helper-hardhat-config";

const deployMockFunc: DeployFunction = async function (
	hre: HardhatRuntimeEnvironment,
) {
	const { deployments, getNamedAccounts, network } = hre;
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();

	if (developmentChains.includes(network.name)) {
		log("Local network detected! Deploying mocks....");
		await deploy("MockV3Aggregator", {
			contract: "MockV3Aggregator",
			from: deployer,
			log: true,
			args: [DECIMALS, INITIAL_ANSWER],
		});
		log("MOCKS DEPLOYED !!!!");
		log("=================================================================");
	}
};

export default deployMockFunc;
deployMockFunc.tags = ["all", "mocks"];
