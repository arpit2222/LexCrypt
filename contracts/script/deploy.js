const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Registry = await hre.ethers.getContractFactory("LexCryptRegistry");
  const JudgeAssistant = await hre.ethers.getContractFactory("JudgeAssistant");
  const WinPredictor = await hre.ethers.getContractFactory("WinPredictor");
  const EvidenceVault = await hre.ethers.getContractFactory("EvidenceVault");
  const PracticeArena = await hre.ethers.getContractFactory("PracticeArena");
  const PrecedentEngine = await hre.ethers.getContractFactory("PrecedentEngine");

  const registry = await Registry.deploy(deployer.address);
  const judge = await JudgeAssistant.deploy(deployer.address, 2, 1);
  const win = await WinPredictor.deploy(deployer.address);
  const evidence = await EvidenceVault.deploy(deployer.address);
  const practice = await PracticeArena.deploy(deployer.address);
  const precedent = await PrecedentEngine.deploy(deployer.address);

  await registry.setModules(judge.target, practice.target, win.target, precedent.target, evidence.target);

  console.log("Registry:", registry.target);
  console.log("JudgeAssistant:", judge.target);
  console.log("WinPredictor:", win.target);
  console.log("EvidenceVault:", evidence.target);
  console.log("PracticeArena:", practice.target);
  console.log("PrecedentEngine:", precedent.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
