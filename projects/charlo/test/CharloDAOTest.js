const CharloDAO = artifacts.require("CharloDAO");
const helper = require("ganache-time-traveler");

contract("CharloDAO Contribution Test", accounts => {

  it("should receive contribution", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[0];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 celo

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const charloBalance = await web3.eth.getBalance(contractAddress);

    assert.equal(charloBalance, amount);
  });

  it("should add contributor to list", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[1];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 celo

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const contributorBalance = await instance.contributors(fromAddress);
    const stakeholderBalance = await instance.stakeholders(fromAddress);

    assert.equal(contributorBalance.toString(), amount);
    assert.equal(stakeholderBalance.toString(), "0");
  });

  it("should make contributor a stakeholder", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[2];
    const contractAddress = instance.address;
    const amount = 200000000000000000000; // 200 celo

    await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount, gasLimit: 1000000});
    
    const stakeholderBalance = await instance.stakeholders(fromAddress);
    const contributorBalance = await instance.contributors(fromAddress);
    
    assert.equal(stakeholderBalance.toString(), amount);
    assert.equal(contributorBalance.toString(), amount);
  });

  it("should create a new proposal", async () => {
    const instance = await CharloDAO.new();
    const contractAddress = instance.address;
    const fromAddress = accounts[3];
    const amount = 20000000000000000000; // 20 celo
    const amountRequested = "1000000000000000000";

    await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount, gasLimit: 1000000});
    await instance.newCharityProposal("My very first charity proposal", amountRequested, {from: fromAddress});

    const createdProposal = await instance.charityProposals(0);

    assert.equal(createdProposal.description, "My very first charity proposal");
    assert.equal(createdProposal.proposer, fromAddress);
    assert.equal(createdProposal.amount, amountRequested);
  });

  it("should vote on proposal", async () => {
    const instance = await CharloDAO.new();
    const voterAddress = accounts[4];
    const requesterAddress = accounts[5]
    const amountToContribute = 20000000000000000000; // 20 celo
    const voterAmount = 200000000000000000000; // 200 celo
    const amountRequested = "5000000000000000000"; // 5 celo

    await web3.eth.sendTransaction({from: voterAddress, to: instance.address, value: voterAmount, gasLimit: 1000000});
    await web3.eth.sendTransaction({from: requesterAddress, to: instance.address, value: amountToContribute, gasLimit: 1000000});
    await instance.newCharityProposal("My very first charity proposal", amountRequested, {from: requesterAddress});

    

    await instance.vote(0, true, {from: voterAddress, gasLimit: 1000000});

    const proposal = await instance.charityProposals(0);
    const voted = await instance.stakeholderVotes(accounts[4], 0);

    assert.equal(voted, 0);
    assert.equal(proposal.votesFor, 1);
    assert.equal(proposal.votesAgainst, 0);
  });

  it("should pay charity", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[6];
    const contractAddress = instance.address;
    const requesterAddress = accounts[7]
    const amount = 200000000000000000000; // 200 celo
    const amountRequested = "20000000000000000000"; // 20 celo

    await web3.eth.sendTransaction({from: requesterAddress, to: contractAddress, value: amount, gasLimit: 1000000});
    await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount, gasLimit: 1000000});
    await instance.newCharityProposal("My very first charity proposal", amountRequested, {from: requesterAddress});

    const proposal = await instance.charityProposals(0);

    const voteResult = await instance.vote(proposal.id, true, {from: fromAddress, gasLimit: 1000000});

    const paymentResult = await instance.payCharity(proposal.id, {from: fromAddress});

    assert.equal(voteResult.receipt.status, true);
    assert.equal(paymentResult.receipt.status, true);
    assert.equal(proposal.paid, true);
  });
});
