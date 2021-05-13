// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CharloDAO is ReentrancyGuard {
    uint32 constant minimumVotingPeriod = 1 weeks;
    uint256 numOfCharities;

    struct CharityRequest {
        uint256 id;
        address payable requester;
        string description;
        uint256 amount;
        uint256 livePeriod;
        uint256 votesFor;
        uint256 votesAgainst;
    }

    event ContributionReceived(address fromAddress, uint256 value);
    event NewStakeholder(address stakeholder);

    mapping(uint256 => CharityRequest) public charityRequests;
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

    function newCharityRequest(string memory description, uint256 amount)
        external
    {
        uint256 charityId = numOfCharities++;
        CharityRequest storage request = charityRequests[charityId];
        request.id = charityId;
        request.requester = payable(msg.sender);
        request.description = description;
        request.amount = amount;
        request.livePeriod = block.timestamp + minimumVotingPeriod; // Check to make sure block.timestamp gives the right time
    }

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
