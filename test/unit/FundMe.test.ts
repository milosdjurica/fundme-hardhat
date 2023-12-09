import { ethers, deployments, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types/";
import { assert, expect } from "chai";

describe("FundMe", () => {
	let fundMe: FundMe;
	let deployer: string;
	let mockV3Aggregator: MockV3Aggregator;
	const sendValue: bigint = ethers.parseEther("1");

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

	describe("fund", () => {
		it("fails if not enough ETH sent", async () => {
			await expect(fundMe.fund()).to.be.revertedWith(
				"You need to spend more ETH!",
			);
		});

		it("updates the amount funded data structure", async () => {
			await fundMe.fund({ value: sendValue });
			const response = await fundMe.getAddressToAmountFunded(deployer);

			assert.equal(response, sendValue);
		});
	});
});
