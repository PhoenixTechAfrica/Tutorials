const CharloDAO = artifacts.require("CharloDAO");

contract("CharloDAO Test", accounts => {
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

  it("should add contributor to list", async () => {
    const instance = await CharloDAO.deployed();
    const fromAddress = accounts[1];
    const contractAddress = instance.address;
    const amount = 2000000000000000000; // 2 ether

    const send = await web3.eth.sendTransaction({from: fromAddress, to: contractAddress, value: amount});
    
    const contributorBalance = await instance.contributors(fromAddress);
    
    assert.equal(contributorBalance.toString(), amount);
  });
});
