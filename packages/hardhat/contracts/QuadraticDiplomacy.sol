//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

contract QuadraticDiplomacy {
    using PRBMathUD60x18 for uint256;

    enum VotingTypes{ONE_TO_ONE, QUADRATIC}
    struct Voting {
        uint id;
        string title;
        uint deadline;
        VotingTypes votingType;
        address creator;
        address[] members;
    }
    struct Member {
        address addr;
        string name;
        uint votingPower;
    }
    struct Vote {
        address voter;
        address votedFor;
        uint weight;
    }

    mapping (uint => Voting) private votings;
    mapping (uint => mapping (address => Member)) private votingMembers;
    mapping (uint => mapping (address => Vote)) private votes;

    uint public totalVotings = 0;

    modifier votingCreator(uint _votingId) {
        require(votings[_votingId].creator == msg.sender, "Must be voting creator");
        _;
    }

    function createVoting(string memory _name, uint _deadline, VotingTypes _votingType, Member[] memory _members) public returns (uint votingId) {
        totalVotings += 1;

    function createVoting(string memory _title, uint _deadline, VotingTypes _votingType, Member[] memory _members) public {
        uint votingId = totalVotings + 1;
        Voting storage voting = votings[votingId];

        voting.id = votingId;
        voting.creator = msg.sender;
        voting.title = _title;
        voting.deadline = _deadline;
        voting.votingType = _votingType;
        for (uint i = 0; i < _members.length; i++) {
            //uniq address check?
            voting.members.push(_members[i].addr);
            votingMembers[votingId][_members[i].addr] = _members[i];
        }

        totalVotings += 1;
    }

    function addMembers(uint _votingId, Member[] memory _members) public votingCreator(_votingId) {
        // deadline check
        Voting storage voting = votings[_votingId];
        require(voting.id > 0, "Voting does not exist");

        for (uint i = 0; i < _members.length; i++) {
            //uniq address check
            voting.members.push(_members[i].addr);
            votingMembers[_votingId][_members[i].addr] = _members[i];
        }
    }

    function makeVote(uint _votingId, address _voteFor) public returns (bool success) {
        //deadline check
        Voting storage voting = votings[_votingId];
        Member storage voter = votingMembers[_votingId][msg.sender];
        Member storage votingFor = votingMembers[_votingId][_voteFor];
        Vote storage voterVote = votes[_votingId][msg.sender];

        require(voter.votingPower != 0, "Voter should be a member of selected voting and have votingPower");
        require(voterVote.weight == 0, "Voter can only vote once");
        require(_voteFor != msg.sender, "Voter can not vote for himself");
        require(votingFor.addr != address(0), "Voter can only vote for existing member");

        uint voteWeight;
        if (voting.votingType == VotingTypes.ONE_TO_ONE) {
            voteWeight = voter.votingPower;
        }
        if (voting.votingType == VotingTypes.QUADRATIC) {
            voteWeight = PRBMathUD60x18.sqrt(voter.votingPower);
        }
        votes[_votingId][msg.sender] = Vote(
            msg.sender,
            _voteFor,
            voteWeight
        );

        return true;
    }

    function getVoting(uint _votingId) public view returns(Voting memory voting) {
        return votings[_votingId];
    }

    function getVotings() public view returns (Voting[] memory) {
        Voting[] memory result = new Voting[](totalVotings);

        for (uint i = 1; i <= totalVotings; i++) {
            result[i - 1] = votings[i];
        }

        return result;
    }

    function getVotingMembers(uint _votingId) public view returns (Member[] memory) {
        address[] storage members = votings[_votingId].members;
        Member[] memory result = new Member[](members.length);

        for (uint i = 0; i < members.length; i++) {
            result[i] = votingMembers[_votingId][members[i]];
        }

        return result;
    }
    function getVotes(uint _votingId) public view returns (Vote[] memory) {
        address[] storage members = votings[_votingId].members;
        Vote[] memory result = new Vote[](members.length);

        for (uint i = 0; i < members.length; i++) {
            result[i] = votes[_votingId][members[i]];
        }

        return result;
    }
}
