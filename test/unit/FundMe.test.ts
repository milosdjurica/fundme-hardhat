import { ethers, deployments, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types/";
import { assert, expect } from "chai";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", () => {
			let fundMe: FundMe;
			let deployer: string;
			let mockV3Aggregator: MockV3Aggregator;
			const sendValue: bigint = ethers.parseEther("1");

			beforeEach(async function () {
				await deployments.fixture(["all"]);

				// const accounts = await ethers.getSigners(); -> this gives all addresses, not only deployer
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe");
				mockV3Aggregator = await ethers.getContract(
					"MockV3Aggregator",
					deployer,
				);

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

				it("adds funder to array of funders", async () => {
					await fundMe.fund({ value: sendValue });
					const funder = await fundMe.s_funders(0);
					assert.equal(funder, deployer);
				});
			});

			describe("withdraw", () => {
				beforeEach(async () => {
					await fundMe.fund({ value: sendValue });
				});

				it("withdraw ETH from a single funder", async () => {
					const startingFundMeBalance = await ethers.provider.getBalance(
						fundMe.getAddress(),
					);
					const startingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(1);

					const { gasPrice, gasUsed } = transactionReceipt!;
					const totalGasCost = gasPrice * gasUsed;

					// console.log("fundMe", fundMe);
					const endingFundMeBalance = await ethers.provider.getBalance(
						fundMe.getAddress(),
					);
					const endingDeployerBalance =
						await ethers.provider.getBalance(deployer);
					assert.equal(Number(endingFundMeBalance), 0);
					assert.equal(
						startingFundMeBalance + startingDeployerBalance,
						endingDeployerBalance + totalGasCost,
					);
				});

				it("allows withdraw with multiple funders", async () => {
					// ARRANGE
					const accounts = await ethers.getSigners();
					// ! start from 1 to avoid taking deployer
					for (let i = 1; i < accounts.length; i++) {
						const fundMeConnectedContract = fundMe.connect(accounts[i]);
						await fundMeConnectedContract.fund({ value: sendValue });
					}
					const startingFundMeBalance = await ethers.provider.getBalance(
						fundMe.getAddress(),
					);
					const startingDeployerBalance =
						await ethers.provider.getBalance(deployer);

					// ACT
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(1);

					const { gasUsed, gasPrice } = transactionReceipt!;
					const totalGasCost = gasUsed * gasPrice;

					// ASSERT
					const endingFundMeBalance = await ethers.provider.getBalance(
						fundMe.getAddress(),
					);
					const endingDeployerBalance =
						await ethers.provider.getBalance(deployer);
					assert.equal(
						startingDeployerBalance + startingFundMeBalance,
						endingDeployerBalance + totalGasCost,
					);

					await expect(fundMe.getFunder(0)).to.be.reverted;
					// await expect(fundMe.fund()).to.be.revertedWith(
					// 	"You need to spend more ETH!",
					// );
					for (let i = 0; i < accounts.length - 1; i++) {
						assert.equal(
							Number(
								await fundMe.getAddressToAmountFunded(accounts[i].address),
							),
							0,
						);
					}
				});

				it("Only allows owner to withdraw", async () => {
					const accounts = await ethers.getSigners();
					const attacker = accounts[1];

					const connectedAttackerToContract = fundMe.connect(attacker);
					await expect(
						connectedAttackerToContract.withdraw(),
					).to.be.revertedWithCustomError(
						connectedAttackerToContract,
						"FundMe__NotOwner",
					);
				});
			});
	  });
