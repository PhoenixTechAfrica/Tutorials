// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title CharloDAO
/// @author TSegun Ogundipe David
contract CharloDAO is AccessControl {
    bytes32 public constant CONTRIBUTOR_ROLE = keccak256("CONTRIBUTOR");
    bytes32 public constant STAKEHOLDER_ROLE = keccak256("STAKEHOLDER");
    // Constant variable that holds the number of days a proposal can be voted on in seconds.
    // `weeks` is a suffix provided by solidity. It translates to the total seconds in a week.
    uint32 constant minimumVotingPeriod = 1 weeks;
    // This variable is incremented everytime a new charity proposal is added.
    // It is needed to iterate through the charyty proposals as solidity doesn't provide a way to step through mappings.
    uint256 numOfProposals;
    // This variable is incremented everytime a new charity proposal is added.
    // It is needed to iterate through the charyty proposals as solidity doesn't provide a way to step through mappings.
    uint256 numOfStakeholders;

    /// @notice Holds all the charity proposals made in the DAO.
    mapping(uint256 => CharityProposal) public charityProposals;
    /// @notice Holds all the stakeholders' address and their total contributions.
    mapping(address => uint256[]) public stakeholderVotes;
    /// @notice Holds all the contributors' address and their total contributions.
    mapping(address => uint256) public contributors;
    /// Holds all the stakeholders' address and their total contributions.
    mapping(address => uint256) public stakeholders;

    /// @notice A new type definition that holds the necessary variables that makes up a charity proposal.
    struct CharityProposal {
        uint256 id;
        uint256 amount;
        uint256 livePeriod;
        uint256 votesFor;
        uint256 votesAgainst;
        string description;
        bool votingPassed;
        bool paid;
        address payable proposer;
        address paidBy;
    }

    /// @notice Event that is emitted when a contribution is received.
    /// @param fromAddress The address the contribution came from.
    /// @param amount The amount of celo that was sent.
    event ContributionReceived(address fromAddress, uint256 amount);
    /// @notice Event that is emitted when a new proposal is added to the list of proposals.
    /// @param proposer The address of the contributer/stakeholder that created the proposal.
    /// @param amount The amount that is requested for.
    event NewCharityProposal(address proposer, uint256 amount);

    modifier onlyStakeholder(string message) {
        require(hasRole(STAKEHOLDER_ROLE, msg.sender), message);
        _;
    }

    modifier onlyContributor(string message) {
        require(hasRole(CONTRIBUTOR_ROLE, msg.sender), message);
        _;
    }

    /// @notice Adds a new proposal to the `charityProposals` mapping.
    /// @param description A brief description of why the proposal should be voted for.
    /// @param amount The amount of celo.
    function newCharityProposal(string calldata description, uint256 amount)
        external
        onlyStakeholder
    {
        uint256 proposalId = numOfProposals++;
        CharityProposal storage proposal = charityProposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = payable(msg.sender);
        proposal.description = description;
        proposal.amount = amount;
        proposal.livePeriod = block.timestamp + minimumVotingPeriod;

        emit NewCharityProposal(msg.sender, amount);
    }

    /// @notice Vote for a particular proposal. Only stakeholders are allowed to vote.
    /// @param proposalId The id of the charity proposal being voted for.
    /// @param supportProposal true to vote for and false against.
    function vote(uint256 proposalId, bool supportProposal)
        external
        onlyStakeholder
    {
        CharityProposal storage charityProposal = charityProposals[proposalId];

        votable(charityProposal);

        if (supportProposal) charityProposal.votesFor++;
        else charityProposal.votesAgainst++;

        stakeholderVotes[msg.sender].push(charityProposal.id);
    }

    /// @notice Contains some conditionals that validate a proposal to be voted on.
    /// @param charityProposal a parameter just like in doxygen (must be followed by parameter name)
    function votable(CharityProposal storage charityProposal) private {
        if (charityProposal.votingPassed)
            revert("Voting period has passed on this proposal");

        if (charityProposal.livePeriod <= block.timestamp) {
            charityProposal.votingPassed = true;
            revert("This proposal can no longer be voted on");
        }

        uint256[] memory tempVotes = stakeholderVotes[msg.sender];
        for (uint256 votes = 0; votes < tempVotes.length; votes++) {
            if (charityProposal.id == tempVotes[votes])
                revert("This stakeholder already voted for this proposal");
        }
    }

    /// @notice This function makes payent to a Charity after the voting period of the proposal. Can only be called by a Stakeholder.
    /// @param proposalId The id of the proposal to pay to.
    function payCharity(uint256 proposalId) external onlyStakeholder {
        CharityProposal storage charityProposal = charityProposals[proposalId];

        if (charityProposal.paid)
            revert("Payment has been made to this proposer");

        if (charityProposal.votesFor <= charityProposal.votesAgainst)
            revert(
                "The proposal does not have the required amount of votes to pass"
            );

        return charityProposal.proposer.transfer(charityProposal.amount);
    }

    receive() external payable {
        makeStakeholder();
    }

    /// @notice This function adds a new stakeholder if the total contribution is >= 200 celo
    function makeStakeholder() private {
        address account = msg.sender;
        uint256 amountContributed = msg.value;
        if (!hasRole(STAKEHOLDER_ROLE, account)) {
            uint256 totalContributed =
                contributors[account] + amountContributed;
            if (totalContributed >= 200 ether) {
                stakeholders[account] = totalContributed;
                contributors[account] += amountContributed;
                _setupRole(STAKEHOLDER_ROLE, account);
            } else {
                contributors[account] += amountContributed;
                _setupRole(CONTRIBUTOR_ROLE, account);
            }
        } else {
            contributors[account] += amountContributed;
            stakeholders[account] += amountContributed;
        }
    }
}
