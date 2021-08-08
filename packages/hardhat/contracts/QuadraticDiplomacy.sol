pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract QuadraticDiplomacy {
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
    enum VotingTypes{ONE_TO_ONE, QUADRATIC}
    struct Voting {
        uint id;
        string name;
        uint deadline;
        VotingTypes votingType;
        address[] members;
    }

    uint public totalVotings;
    mapping (uint => Voting) public votings;
    mapping (uint => mapping (address => Member)) public votingMembers;
    mapping (uint => mapping (address => Vote)) public votes;

    constructor() {
        totalVotings = 0;
    }

    function sqrt(uint x) private returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function createVoting(string memory _name, uint _deadline, VotingTypes _votingType, Member[] memory _members) public returns (uint votingId) {
        totalVotings += 1;

        Voting storage voting = votings[totalVotings];

        voting.id = totalVotings;
        voting.name = _name;
        voting.deadline = _deadline;
        voting.votingType = _votingType;
        for (uint i = 0; i < _members.length; i++) {
            //uniq address check
            voting.members.push(_members[i].addr);
            votingMembers[totalVotings][_members[i].addr] = _members[i];
        }

        return totalVotings;
    }

    function addMembers(uint _votingId, Member[] memory _members) public returns (bool success) {
        Voting storage voting = votings[_votingId];
        require(voting.id > 0, "Voting does not exist");

        for (uint i = 0; i < _members.length; i++) {
            //uniq address check
            voting.members.push(_members[i].addr);
            votingMembers[_votingId][_members[i].addr] = _members[i];
        }

        return true;
    }

    function getVotings() public view returns (Voting[] memory) {
        Voting[] memory result = new Voting[](totalVotings);

        for (uint i = 0; i < totalVotings; i++) {
            result[i] = votings[i];
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

    function vote(uint _votingId, address _voteFor) public returns (bool success) {
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
            voteWeight = sqrt(voter.votingPower);
        }
        votes[_votingId][msg.sender] = Vote(
            msg.sender,
            _voteFor,
            voteWeight
        );

        return true;
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
