// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharloDAO {
    uint32 constant minimumVotingPeriod = 1 weeks;
    uint256 numOfCharities;
    uint256 numOfShareholders;

    mapping(uint256 => CharityRequest) public charityRequests;
    mapping(address => uint256[]) public shareholderVotes;
    mapping(address => uint256) public contributors;
    mapping(address => uint256) public shareholders;

    struct CharityRequest {
        uint256 id;
        address payable requester;
        string description;
        uint256 amount;
        uint256 livePeriod;
        uint256 votesFor;
        uint256 votesAgainst;
        bool votingPassed;
        bool paid;
        address paidBy;
    }

    event ContributionReceived(address fromAddress, uint256 value);
    event NewShareholder(address shareholder);
    event NewCharityRequest(address requester, uint256 amount);

    modifier makeShareholder() {
        if (shareholders[msg.sender] == 0) {
            uint256 contributed = contributors[msg.sender] + msg.value;
            if (contributed >= 5 ether) {
                shareholders[msg.sender] = contributed;
                numOfShareholders++;
                emit NewShareholder(msg.sender);
            }
        } else {
            shareholders[msg.sender] += msg.value;
        }
        _;
    }

    modifier onlyShareholder() {
        bool found = false;
        for (uint256 i = 0; i < numOfShareholders; i++) {
            if (shareholders[msg.sender] != 0) {
                found = true;
                break;
            }
        }

        if (!found) revert("Only shareholders are allowed to vote");

        _;
    }

    function newCharityRequest(string calldata description, uint256 amount)
        external
    {
        uint256 charityId = numOfCharities++;
        CharityRequest storage request = charityRequests[charityId];
        request.id = charityId;
        request.requester = payable(msg.sender);
        request.description = description;
        request.amount = amount;
        request.livePeriod = block.timestamp + minimumVotingPeriod;

        emit NewCharityRequest(msg.sender, amount);
    }

    function vote(uint256 requestId, bool supportRequest)
        external
        onlyShareholder
    {
        CharityRequest storage charityRequest = charityRequests[requestId];

        if (charityRequest.votingPassed)
            revert("Voting period has passed on this request");

        if (charityRequest.livePeriod <= block.timestamp) {
            charityRequest.votingPassed = true;
            revert("This request can no longer be voted on");
        }

        uint256[] memory tempVotes = shareholderVotes[msg.sender];
        for (uint256 votes = 0; votes < tempVotes.length; votes++) {
            if (requestId == tempVotes[votes])
                revert("Shareholder already voted for this request");
        }

        if (supportRequest) charityRequest.votesFor++;
        else charityRequest.votesAgainst++;

        shareholderVotes[msg.sender].push(charityRequest.id);
    }

    function payRequester(uint256 requestId) external onlyShareholder {
        CharityRequest storage charityRequest = charityRequests[requestId];

        if (charityRequest.paid)
            revert("Payment has been made to this requester");

        if (charityRequest.votesFor <= charityRequest.votesAgainst)
            revert(
                "The request does not have the required amount of votes to pass"
            );

        return charityRequest.requester.transfer(charityRequest.amount);
    }

    receive() external payable makeShareholder {
        contributors[msg.sender] += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }
}
