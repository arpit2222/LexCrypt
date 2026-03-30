const { expect } = require("chai");

const asEuint32 = (value) => BigInt(value);

describe("LexCrypt MVP", function () {
  it("analyzes a case and stores a verdict", async function () {
    const [admin] = await ethers.getSigners();

    const JudgeAssistant = await ethers.getContractFactory("JudgeAssistant");
    const judge = await JudgeAssistant.deploy(admin.address, 2, 1);

    const caseId = ethers.keccak256(ethers.toUtf8Bytes("case-1"));
    const input = {
      encCaseDataHash: 1,
      encEvidenceScore: asEuint32(40),
      encPriorConvictions: asEuint32(10),
      encCaseTypeCode: asEuint32(2),
      encJurisdiction: asEuint32(5),
      encIsJuvenile: 0,
      encSensitivityTier: 2
    };

    await judge.analyzeCase(caseId, input, ethers.ZeroHash);
    const result = await judge.getAnalysisPlain(caseId);
    expect(result.verdictScore).to.be.gt(0n);
  });

  it("predicts win probability", async function () {
    const [admin] = await ethers.getSigners();

    const WinPredictor = await ethers.getContractFactory("WinPredictor");
    const winPredictor = await WinPredictor.deploy(admin.address);

    const caseId = ethers.keccak256(ethers.toUtf8Bytes("case-2"));
    const input = {
      encEvidenceScore: asEuint32(30),
      encPriorConvictions: asEuint32(2),
      encCaseTypeCode: asEuint32(1),
      encJurisdiction: asEuint32(1),
      encClaimAmount: asEuint32(50)
    };

    await winPredictor.predictWin(caseId, input, ethers.ZeroHash);
    const probability = await winPredictor.getWinProbabilityPlain(caseId);
    expect(probability).to.be.at.most(100n);
  });

  it("stores sealed evidence with IPFS hash", async function () {
    const [admin] = await ethers.getSigners();
    const EvidenceVault = await ethers.getContractFactory("EvidenceVault");
    const vault = await EvidenceVault.deploy(admin.address);

    const cidHash = ethers.keccak256(ethers.toUtf8Bytes("ipfs://demo"));
    const tx = await vault.submitEvidence(1, 2, cidHash);
    const receipt = await tx.wait();
    const parsed = receipt.logs
      .map((log) => {
        try {
          return vault.interface.parseLog(log);
        } catch (error) {
          return null;
        }
      })
      .find((event) => event && event.name === "EvidenceSealed");
    const vaultId = parsed.args.vaultId;

    const data = await vault.getEvidencePlain(vaultId);
    expect(data.cidHash).to.equal(cidHash);
    expect(data.state).to.equal(0);
  });

  it("scores a practice arena attempt", async function () {
    const [admin] = await ethers.getSigners();
    const PracticeArena = await ethers.getContractFactory("PracticeArena");
    const arena = await PracticeArena.deploy(admin.address);

    const caseId = ethers.keccak256(ethers.toUtf8Bytes("practice-1"));
    const cidHash = ethers.keccak256(ethers.toUtf8Bytes("ipfs://practice"));
    await arena.submitAttempt(caseId, 10, 20, 5, cidHash, ethers.ZeroHash);

    const result = await arena.getAttemptPlain(caseId);
    expect(result.totalScore).to.be.at.most(100n);
  });

  it("searches precedents by encrypted tags", async function () {
    const [admin] = await ethers.getSigners();
    const PrecedentEngine = await ethers.getContractFactory("PrecedentEngine");
    const engine = await PrecedentEngine.deploy(admin.address);

    const precedentId = ethers.keccak256(ethers.toUtf8Bytes("precedent-1"));
    const cidHash = ethers.keccak256(ethers.toUtf8Bytes("ipfs://precedent"));
    await engine.addPrecedent(precedentId, 1, 2, cidHash);

    const queryId = ethers.keccak256(ethers.toUtf8Bytes("query-1"));
    await engine.searchPrecedents(queryId, 1, 2, ethers.ZeroHash);
    const count = await engine.getMatchCountPlain(queryId);
    expect(count).to.equal(1n);
  });
});
