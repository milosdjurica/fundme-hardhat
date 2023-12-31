// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
	using PriceConverter for uint256;

	uint public constant MINIMUM_USD = 50 * 10 ** 18;
	address private immutable i_owner;
	address[] public s_funders;
	mapping(address => uint256) public s_addressToAmountFunded;
	AggregatorV3Interface public s_priceFeed;

	modifier onlyOwner() {
		// require(msg.sender == i_owner);
		if (msg.sender != i_owner) revert FundMe__NotOwner();
		_;
	}

	constructor(address priceFeed) {
		s_priceFeed = AggregatorV3Interface(priceFeed);
		i_owner = msg.sender;
	}

	function fund() public payable {
		uint256 minimumUSD = 50 * 10 ** 18;
		require(
			msg.value.getConversionRate(s_priceFeed) >= minimumUSD,
			"You need to spend more ETH!"
		);
		// require(PriceConverter.getConversionRate(msg.value) >= minimumUSD, "You need to spend more ETH!");
		s_addressToAmountFunded[msg.sender] += msg.value;
		s_funders.push(msg.sender);
	}

	function withdraw() public onlyOwner {
		for (
			uint256 funderIndex = 0;
			funderIndex < s_funders.length;
			funderIndex++
		) {
			address funder = s_funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0);
		(bool success, ) = i_owner.call{value: address(this).balance}("");
		require(success);
	}

	function cheaperWithdraw() public payable onlyOwner {
		address[] memory funders = s_funders;
		// mappings can't be in memory, sorry!
		for (
			uint256 funderIndex = 0;
			funderIndex < funders.length;
			funderIndex++
		) {
			address funder = funders[funderIndex];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0);
		(bool success, ) = i_owner.call{value: address(this).balance}("");
		require(success);
	}

	/** @notice Gets the amount that an address has funded
	 *  @param fundingAddress the address of the funder
	 *  @return the amount funded
	 */
	function getAddressToAmountFunded(
		address fundingAddress
	) public view returns (uint256) {
		return s_addressToAmountFunded[fundingAddress];
	}

	function getVersion() public view returns (uint256) {
		return s_priceFeed.version();
	}

	function getFunder(uint256 index) public view returns (address) {
		return s_funders[index];
	}

	function getOwner() public view returns (address) {
		return i_owner;
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return s_priceFeed;
	}
}
