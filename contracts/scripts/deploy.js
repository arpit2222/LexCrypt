const hre = require("hardhat");

async function main() {
  console.log("Starting Deployment to Arbitrum CoFHE (Fhenix)...");

  // 1. Deploy LegalContractFHE (Multi-Sig enabled)
  const LegalContractFHE = await hre.ethers.getContractFactory("LegalContractFHE");
  const legalContract = await LegalContractFHE.deploy();
  await legalContract.waitForDeployment();
  const legalAddress = await legalContract.getAddress();
  console.log(`✅ LegalContractFHE deployed to: ${legalAddress}`);

  // 2. Deploy ConfidentialEscrow (Privara SDK simulation)
  const ConfidentialEscrow = await hre.ethers.getContractFactory("ConfidentialEscrow");
  const escrowContract = await ConfidentialEscrow.deploy();
  await escrowContract.waitForDeployment();
  const escrowAddress = await escrowContract.getAddress();
  console.log(`✅ ConfidentialEscrow deployed to: ${escrowAddress}`);

  console.log("\nDeployment Successful!");
  console.log("Update your README.md and frontend with these live addresses to secure the Fhenix Ecosystem Grant.");
}

main().catch((error) => {
  console.error("Deployment Failed:", error);
  process.exitCode = 1;
});
