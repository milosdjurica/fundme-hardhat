import { ethers, deployments, getNamedAccounts } from "hardhat";
import { FundMe } from "../../typechain-types/contracts/FundMe";

describe("Token", () => {
	beforeEach(async function () {
		await deployments.fixture(["all"]);

		// const accounts = await ethers.getSigners(); -> this gives all addresses, not only deployer
		const { deployer } = await getNamedAccounts();
		const FundMe: FundMe = await ethers.getContract("FundMe", deployer);

		console.log("FundMe", FundMe);
	});
});
