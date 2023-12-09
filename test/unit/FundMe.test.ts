import { ethers, deployments, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types/";
import { assert } from "chai";

describe("FundMe", () => {
	let fundMe: FundMe;
	let deployer;
	let mockV3Aggregator: MockV3Aggregator;
	beforeEach(async function () {
		await deployments.fixture(["all"]);

		// const accounts = await ethers.getSigners(); -> this gives all addresses, not only deployer
		deployer = (await getNamedAccounts()).deployer;
		fundMe = await ethers.getContract("FundMe", deployer);
		mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);

		// console.log("FundMe", fundMe);
	});

	describe("constructor", () => {
		it("sets the aggregator addresses correctly", async () => {
			const response = await fundMe.getPriceFeed();
			assert.equal(response, await mockV3Aggregator.getAddress());
		});
	});
});
