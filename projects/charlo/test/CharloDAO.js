const CharloDAO = artifacts.require("CharloDAO");

contract("CharloDAO Contribution Test", accounts => {
  it("should receive contribution", async () => {
    const instance = await CharloDAO.deployed();
    const fromAddress = accounts[0];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const charloBalance = await web3.eth.getBalance(contractAddress);

    assert.equal(charloBalance, amount);
  });

  it("should add contributor to list", async () => {
    const instance = await CharloDAO.deployed();
    const fromAddress = accounts[1];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const contributorBalance = await instance.contributors(fromAddress);

    assert.equal(contributorBalance.toString(), amount);
  });

  it("should make contributor a stakeholder", async () => {
    const instance = await CharloDAO.deployed();
    const fromAddress = accounts[2];
    const contractAddress = instance.address;
    const amount = 5000000000000000000; // 5 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const stakeholderBalance = await instance.stakeholders(fromAddress);
    
    assert.equal(stakeholderBalance.toString(), amount);
  });
});

contract("CharloDAO Charity Request Test", accounts => {
  it("should create a new request", async () => {
    const instance = await CharloDAO.deployed();
    await instance.newCharityRequest("My very first charity request", "1000000000000000000");

    const createdRequest = await instance.charityRequests(0);

    assert.equal(createdRequest.description, "My very first charity request");
    assert.equal(createdRequest.requester, accounts[0]);
    assert.equal(createdRequest.amount, "1000000000000000000");
  });
});
