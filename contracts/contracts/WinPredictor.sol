// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MockFHE.sol";

contract WinPredictor is AccessControl, ReentrancyGuard {
    using MockFHE for *;

    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    struct WinInput {
        MockFHE.euint32 encEvidenceScore;
        MockFHE.euint32 encPriorConvictions;
        MockFHE.euint32 encCaseTypeCode;
        MockFHE.euint32 encJurisdiction;
        MockFHE.euint32 encClaimAmount;
    }

    mapping(bytes32 => MockFHE.euint32) private winProbabilities;

    event WinPrediction(bytes32 indexed caseId, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(JUDGE_ROLE, admin);
    }

    function predictWin(bytes32 caseId, WinInput calldata input, bytes32 permitHash)
        external
        onlyRole(JUDGE_ROLE)
        nonReentrant
        returns (bytes32 resultHandle)
    {
        permitHash;
        MockFHE.euint32 score = MockFHE.asEuint32(0);

        score = MockFHE.add(score, MockFHE.mul(input.encEvidenceScore, MockFHE.asEuint32(2)));
        score = MockFHE.add(score, MockFHE.mul(input.encPriorConvictions, MockFHE.asEuint32(3)));
        score = MockFHE.add(score, MockFHE.mul(input.encCaseTypeCode, MockFHE.asEuint32(1)));

        MockFHE.euint32 clamped = MockFHE.min(score, MockFHE.asEuint32(100));
        winProbabilities[caseId] = clamped;

        MockFHE.allowThis(clamped);
        MockFHE.allowSender(clamped);

        emit WinPrediction(caseId, block.timestamp);
        return bytes32(MockFHE.euint32.unwrap(clamped));
    }

    function getWinProbabilityPlain(bytes32 caseId) external view returns (uint256 probability) {
        probability = MockFHE.euint32.unwrap(winProbabilities[caseId]);
    }
}
