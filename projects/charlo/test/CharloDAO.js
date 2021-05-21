const CharloDAO = artifacts.require("CharloDAO");
const helper = require("ganache-time-traveler");

contract("CharloDAO Contribution Test", accounts => {

  it("should receive contribution", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[0];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const charloBalance = await web3.eth.getBalance(contractAddress);

    assert.equal(charloBalance, amount);
  });

  it("should add contributor to list", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[1];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const contributorBalance = await instance.contributors(fromAddress);

    assert.equal(contributorBalance.toString(), amount);
  });

  it("should make contributor a shareholder", async () => {
    const instance = await CharloDAO.new();
    const fromAddress = accounts[2];
    const contractAddress = instance.address;
    const amount = 5000000000000000000; // 5 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const shareholderBalance = await instance.shareholders(fromAddress);
    
    assert.equal(shareholderBalance.toString(), amount);
  });

  it("should create a new request", async () => {
    const instance = await CharloDAO.new();
    await instance.newCharityRequest("My very first charity request", "1000000000000000000", {from: accounts[4]});

    const createdRequest = await instance.charityRequests(0);

    assert.equal(createdRequest.description, "My very first charity request");
    assert.equal(createdRequest.requester, accounts[4]);
    assert.equal(createdRequest.amount, "1000000000000000000");
  });

  it("should vote on request", async () => {
    const instance = await CharloDAO.new();

    await instance.newCharityRequest("My very first charity request", "2000000000000000000");

    await web3.eth.sendTransaction({from: accounts[3], to: instance.address, value: 5000000000000000000});

    const result = await instance.vote(0, true, {from: accounts[3]});

    const request = await instance.charityRequests(0);
    const voted = await instance.shareholderVotes(accounts[3], 0);

    assert.equal(voted, 0)
    assert.equal(request.votesFor, 1)
    assert.equal(request.votesAgainst, 0)
  });

  it("should pay requester", async () => {
    const instance = await CharloDAO.new();

    const fromAddress = accounts[5];
    const contractAddress = instance.address;
    const amount = 5000000000000000000; // 5 ether

    await instance.newCharityRequest("My very first charity request", "2000000000000000000", {from: accounts[6]});

    await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});

    const request = await instance.charityRequests(0);

    const voteResult = await instance.vote(request.id, true, {from: fromAddress});

    const paymentResult = await instance.payRequester(request.id, {from: fromAddress});

    assert.equal(voteResult.receipt.status, true)
    assert.equal(paymentResult.receipt.status, true)
  });
});
