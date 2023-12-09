import { ethers, getNamedAccounts } from "hardhat";
import { FundMe } from "../typechain-types";

export const withdraw = async () => {
	const { deployer } = await getNamedAccounts();

	const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
	console.log(`Got contract FundMe at ${fundMe.getAddress()}`);
	console.log("Withdrawing from contract...");
	const transactionResponse = await fundMe.withdraw();
	await transactionResponse.wait(1);

	console.log("Withdraw successfully passed!");
};
