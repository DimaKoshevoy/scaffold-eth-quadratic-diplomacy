const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const daiWhale1 = '0xe5f8086dac91e039b1400febf0ab33ba3487f29a';
const daiWhale2 = '0xd624790fc3e318ce86f509ecf69df440b3fc328d';
const daiWhale3 = '0x4f868c1aa37fcf307ab38d215382e88fca6275e2';


const testMember1 = {
  addr: daiWhale1,
  name: 'John',
  votingPower: 9
};
const testMember2 = {
  addr: daiWhale2,
  name: 'Alex',
  votingPower: 25
};
const testMembers = [testMember1, testMember2];
const testVoting = {
  name: 'Test Voting',
  deadline: 123,
  votingType: 1,
  members: testMembers.map(memberData => [...Object.values(memberData)])
};


const one = ethers.BigNumber.from(1);

describe("QuadraticDiplomacy", function () {
  let deployer;
  let QuadraticDiplomacy;

  it("Should be deployable", async function () {
    const [signer] = await ethers.getSigners();
    deployer = signer.address;

    const QuadraticDiplomacyContract = await ethers.getContractFactory("QuadraticDiplomacy");
    QuadraticDiplomacy = await QuadraticDiplomacyContract.deploy();
  });

  it("Should be able to create voting", async function () {
    const totalVotingsBefore = await QuadraticDiplomacy.totalVotings();
    expect(totalVotingsBefore.isZero()).to.be.true;

    await QuadraticDiplomacy.createVoting(testVoting.name, testVoting.deadline, testVoting.votingType, testVoting.members);

    const totalVotingsAfter = await QuadraticDiplomacy.totalVotings();
    expect(totalVotingsAfter.eq(one)).to.be.true;
  });

  describe('Created voting',() => {
    const expectedId = 1;
    let createdVoting;

    before(async () => {
      createdVoting = await QuadraticDiplomacy.getVoting(expectedId);
    });

    it('Voting data should be correctly stored', async () => {
      expect(createdVoting.id.eq(one)).to.be.true;
      expect(createdVoting.deadline.eq(ethers.BigNumber.from(testVoting.deadline))).to.be.true;
      expect(createdVoting.votingType).to.be.equal(testVoting.votingType);
      expect(createdVoting.creator).to.be.equal(deployer);
      expect(createdVoting.members.map(value => value.toLowerCase())).to.be.deep.equal(testVoting.members.map(([addr]) => addr));
    });

    it('Members data should correctly stored', async () => {
      const votingMembers = await QuadraticDiplomacy.getVotingMembers(expectedId);

      votingMembers.forEach(({addr, name, votingPower}, index) => {
        expect(addr.toLowerCase()).to.be.equal(testMembers[index].addr);
        expect(name).to.be.equal(testMembers[index].name);
        expect(votingPower.eq(ethers.BigNumber.from(testMembers[index].votingPower))).to.be.true;
      });
    });
  });
});
