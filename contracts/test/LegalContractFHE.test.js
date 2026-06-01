const { expect } = require("chai");
const { ethers } = require("hardhat");
const { FhenixClient } = require("fhenixjs");

describe("LegalContractFHE", function () {
  let contract;
  let owner;
  let counterparty;
  let fhenixClient;

  before(async function () {
    [owner, counterparty] = await ethers.getSigners();
    
    // Deploy the contract
    const LegalContractFHE = await ethers.getContractFactory("LegalContractFHE");
    contract = await LegalContractFHE.deploy();
    await contract.waitForDeployment();
    
    // Initialize Fhenix client for local testing
    fhenixClient = new FhenixClient({
      provider: ethers.provider,
    });
  });

  it("Should create an encrypted agreement without exposing terms", async function () {
    // 1. Simulate client-side encryption of the Earnout Threshold (e.g., $20,000,000)
    const targetThreshold = 20000000;
    const encryptedThreshold = await fhenixClient.encrypt_uint32(targetThreshold);
    
    // Encrypt the deadline
    const deadline = Math.floor(Date.now() / 1000) + 86400; // +1 day
    const encryptedDeadline = await fhenixClient.encrypt_uint32(deadline);
    
    // 2. Send the ENCRYPTED data to the blockchain
    const tx = await contract.createAgreement(
      counterparty.address,
      encryptedThreshold,
      encryptedDeadline
    );
    await tx.wait();
    
    // 3. Verify agreement was created successfully
    const agreement = await contract.agreements(0);
    expect(agreement.party1).to.equal(owner.address);
    expect(agreement.party2).to.equal(counterparty.address);
    // 0 is Draft status
    expect(agreement.status).to.equal(0);
  });

  it("Should correctly compute Earnout on encrypted actual performance", async function () {
    // We previously set the encrypted threshold to $20,000,000.
    // Let's say actual performance was $25,000,000 (meaning earnout should trigger).
    
    const actualPerformance = 25000000;
    // We encrypt the actual performance before sending it to the contract
    const encryptedActual = await fhenixClient.encrypt_uint32(actualPerformance);
    
    // The contract compares actual > threshold ENTIRELY on ciphertext
    const tx = await contract.executeEarnoutPayment(0, encryptedActual);
    const receipt = await tx.wait();
    
    // The contract emits an event with the decrypted boolean result for our demo
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === 'EarnoutExecuted'
    );
    
    expect(event).to.not.be.undefined;
    // The boolean result should be true since 25M > 20M
    expect(event.args.conditionMet).to.be.true;
  });

  it("Should fail the Earnout if performance is below threshold", async function () {
    // Let's say actual performance was only $15,000,000.
    const actualPerformance = 15000000;
    const encryptedActual = await fhenixClient.encrypt_uint32(actualPerformance);
    
    const tx = await contract.executeEarnoutPayment(0, encryptedActual);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === 'EarnoutExecuted'
    );
    
    // The boolean result should be false since 15M is NOT > 20M
    expect(event.args.conditionMet).to.be.false;
  });
});
