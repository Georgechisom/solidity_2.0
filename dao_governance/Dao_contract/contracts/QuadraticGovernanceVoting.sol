// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title QuadraticGovernanceVoting
 * @dev DAO-style governance with quadratic token-weighted voting,
 * quorum requirement, and executable proposals (ETH transfer).
 */
contract QuadraticGovernanceVoting {
    struct Proposal {
        string description;        // what is being voted on
        address payable recipient; // who receives ETH if passed
        uint amount;               // how much ETH to send
        uint voteCount;            // total votes (quadratically weighted)
        uint deadline;             // voting deadline
        bool executed;             // has proposal been executed
    }

    IERC20 public governanceToken; // ERC20 token used for voting power
    address public chairperson;    // deployer / DAO admin
    uint public quorum;            // minimum votes required

    Proposal[] public proposals;   // list of all proposals
    mapping(uint => mapping(address => bool)) public hasVoted; // proposalId -> voter -> voted?

    event ProposalCreated(uint indexed proposalId, string description, address recipient, uint amount, uint deadline);
    event Voted(address indexed voter, uint indexed proposalId, uint weight);
    event Executed(uint indexed proposalId, bool success);
    event ETHRecieved(uint indexed amount, address indexed  sender, uint timestamp);

    constructor(address _token, uint _quorum) {
        governanceToken = IERC20(_token);
        chairperson = msg.sender;
        quorum = _quorum;
    }

    /**
     * @dev Allows chairperson to create a new proposal.
     * @param _description What the proposal is about.
     * @param _recipient Who receives ETH if the proposal passes.
     * @param _amount How much ETH to send if approved.
     * @param _duration Voting period in seconds.
     */
    function createProposal(
        string memory _description,
        address payable _recipient,
        uint _amount,
        uint _duration
    ) external {
        require(msg.sender == chairperson, "Only chairperson can create proposals");
        require(address(this).balance >= _amount, "Not enough funds in treasury");

        uint deadline = block.timestamp + _duration;

        proposals.push(Proposal({
            description: _description,
            recipient: _recipient,
            amount: _amount,
            voteCount: 0,
            deadline: deadline,
            executed: false
        }));

        emit ProposalCreated(proposals.length - 1, _description, _recipient, _amount, deadline);
    }

    /**
     * @dev Vote for a proposal using quadratic voting power.
     * @param _proposalId The ID of the proposal to vote on.
     */
    function vote(uint _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        uint balance = governanceToken.balanceOf(msg.sender);
        require(balance > 0, "No voting power");

        uint weight = sqrt(balance); // ✅ Quadratic voting power

        proposal.voteCount += weight;
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(msg.sender, _proposalId, weight);
    }

    /**
     * @dev Execute a proposal if it has passed quorum and not already executed.
     * Transfers ETH to the recipient if successful.
     * @param _proposalId The ID of the proposal to execute.
     */
    function executeProposal(uint _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Voting still active");
        require(!proposal.executed, "Already executed");

        bool success = false;

        if (proposal.voteCount >= quorum) {
            proposal.executed = true;
            (success, ) = proposal.recipient.call{value: proposal.amount}("");
        }

        emit Executed(_proposalId, success);
    }

    /**
     * @dev Get the total number of proposals.
     */
    function getProposalCount() external view returns (uint) {
        return proposals.length;
    }

    /**
     * @dev Square root helper (Babylonian method).
     */
    function sqrt(uint x) internal pure returns (uint y) {
        if (x == 0) return 0;
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    receive() external payable {
        emit ETHRecieved(msg.value, msg.sender, block.timestamp);
    }

}