// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CharloDAO {
    // uint32 constant minimumVotingPeriod = 1 weeks;

    // struct CharityRequest {
    //     address payable requester;
    // }
    event ContributionReceived(address fromAddress, uint256 value);

    mapping(address => uint256) public contributors;
    mapping(address => uint256) public stakeHolders;

    // function getBalance() external view returns (uint256 balance) {
    //     balance = address(this).balance;
    // }

    // function sendCelo(uint256 amount, address payable receiver)
    //     external
    //     returns (bool)
    // {
    //     receiver.transfer(amount);
    // }

    receive() external payable {
        contributors[msg.sender] += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }
}
