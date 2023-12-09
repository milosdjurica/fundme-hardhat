import { ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { FundMe } from "../../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { assert } from "chai";

developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe Staging", async () => {
			let fundMe: FundMe;
			let deployer: Address;
			const sendValue = ethers.parseEther("1");

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer);
			});

			it("Allows people to fund and withdraw", async () => {
				await fundMe.fund({ value: sendValue });
				await fundMe.withdraw();
				const endingFundMeBalance = await ethers.provider.getBalance(
					fundMe.getAddress(),
				);
				assert.equal(Number(endingFundMeBalance), 0);
			});
	  });
