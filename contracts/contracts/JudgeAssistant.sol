// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MockFHE.sol";

contract JudgeAssistant is AccessControl, ReentrancyGuard {
    using MockFHE for *;

    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    struct CaseAnalysisInput {
        MockFHE.euint128 encCaseDataHash;
        MockFHE.euint32 encEvidenceScore;
        MockFHE.euint32 encPriorConvictions;
        MockFHE.euint32 encCaseTypeCode;
        MockFHE.euint32 encJurisdiction;
        MockFHE.euint8 encIsJuvenile;
        MockFHE.euint8 encSensitivityTier;
    }

    struct CaseAnalysisResult {
        MockFHE.euint32 encVerdictScore;
        MockFHE.euint32 encMinSentenceMonths;
        MockFHE.euint32 encMaxSentenceMonths;
        MockFHE.euint32 encPrecedentCount;
        MockFHE.ebool encHighRiskFlag;
        uint256 analysisTimestamp;
        bytes32 commitmentHash;
    }

    mapping(bytes32 => CaseAnalysisResult) public analysisResults;

    MockFHE.euint32 private immutable WEIGHT_EVIDENCE;
    MockFHE.euint32 private immutable WEIGHT_PRIOR;

    event CaseAnalyzed(bytes32 indexed caseId, bytes32 commitmentHash, uint256 timestamp);

    constructor(address admin, uint32 weightEvidence, uint32 weightPrior) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(JUDGE_ROLE, admin);
        WEIGHT_EVIDENCE = MockFHE.asEuint32(weightEvidence);
        WEIGHT_PRIOR = MockFHE.asEuint32(weightPrior);
    }

    function analyzeCase(
        bytes32 caseId,
        CaseAnalysisInput calldata input,
        bytes32 permitHash
    ) external onlyRole(JUDGE_ROLE) nonReentrant returns (bytes32 resultHandle) {
        permitHash;
        MockFHE.euint32 evScore = input.encEvidenceScore;
        MockFHE.euint32 priorConvs = input.encPriorConvictions;
        MockFHE.euint8 juvenile = input.encIsJuvenile;

        MockFHE.euint32 weightedEvidence = MockFHE.mul(evScore, WEIGHT_EVIDENCE);
        MockFHE.euint32 weightedPrior = MockFHE.mul(priorConvs, WEIGHT_PRIOR);
        MockFHE.euint32 baseScore = MockFHE.add(weightedEvidence, weightedPrior);

        MockFHE.euint32 juvenileCap = MockFHE.asEuint32(30);
        MockFHE.ebool isJuvenile = MockFHE.eq(juvenile, MockFHE.asEuint8(1));
        MockFHE.euint32 adjustedScore = MockFHE.select(
            isJuvenile,
            MockFHE.min(baseScore, juvenileCap),
            baseScore
        );

        MockFHE.ebool highRisk = MockFHE.gte(adjustedScore, MockFHE.asEuint32(85));

        MockFHE.allowThis(adjustedScore);
        MockFHE.allowSender(adjustedScore);
        MockFHE.allowSender(highRisk);

        bytes32 commitment = keccak256(abi.encode(caseId, block.timestamp, msg.sender));

        analysisResults[caseId] = CaseAnalysisResult({
            encVerdictScore: adjustedScore,
            encMinSentenceMonths: MockFHE.asEuint32(6),
            encMaxSentenceMonths: MockFHE.asEuint32(60),
            encPrecedentCount: MockFHE.asEuint32(12),
            encHighRiskFlag: highRisk,
            analysisTimestamp: block.timestamp,
            commitmentHash: commitment
        });

        emit CaseAnalyzed(caseId, commitment, block.timestamp);
        return bytes32(MockFHE.euint32.unwrap(adjustedScore));
    }

    function getAnalysisPlain(bytes32 caseId)
        external
        view
        returns (uint256 verdictScore, uint256 highRisk, uint256 timestamp, bytes32 commitment)
    {
        CaseAnalysisResult storage result = analysisResults[caseId];
        verdictScore = MockFHE.euint32.unwrap(result.encVerdictScore);
        highRisk = MockFHE.ebool.unwrap(result.encHighRiskFlag);
        timestamp = result.analysisTimestamp;
        commitment = result.commitmentHash;
    }
}
