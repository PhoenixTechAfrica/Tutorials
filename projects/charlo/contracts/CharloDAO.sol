// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CharloDAO {
    // uint32 constant minimumVotingPeriod = 1 weeks;

    // struct CharityRequest {
    //     address payable requester;
    // }
    event ContributionReceived(address fromAddress, uint256 value);
    event NewStakeholder(address stakeholder);

    mapping(address => uint256) public contributors;
    mapping(address => uint256) public stakeholders;

    modifier makeStakeholder() {
        if (stakeholders[msg.sender] == 0) {
            uint256 contributed = contributors[msg.sender] + msg.value;
            if (contributed >= 5 ether) {
                stakeholders[msg.sender] = contributed;
                emit NewStakeholder(msg.sender);
            }
        } else {
            stakeholders[msg.sender] += msg.value;
        }
        _;
    }

    // function getBalance() external view returns (uint256 balance) {
    //     balance = address(this).balance;
    // }

    // function sendCelo(uint256 amount, address payable receiver)
    //     external
    //     returns (bool)
    // {
    //     receiver.transfer(amount);
    // }

    receive() external payable makeStakeholder {
        contributors[msg.sender] += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }
}
