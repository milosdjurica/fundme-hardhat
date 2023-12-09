import { ethers, getNamedAccounts } from "hardhat";
import { FundMe } from "../typechain-types";

export const main = async () => {
	const { deployer } = await getNamedAccounts();

	const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
	console.log(`Got contract FundMe at ${fundMe.getAddress()}`);
	console.log("Funding contract...");

	const transactionResponse = await fundMe.fund({
		value: ethers.parseEther("0.05"),
	});

	await transactionResponse.wait(1);
	console.log("Funded!");
};
