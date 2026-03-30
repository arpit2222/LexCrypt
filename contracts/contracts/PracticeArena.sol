// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MockFHE.sol";

contract PracticeArena is AccessControl, ReentrancyGuard {
    using MockFHE for *;

    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    struct PracticeAttempt {
        MockFHE.euint32 encTotalScore;
        MockFHE.euint32 encArgumentScore;
        MockFHE.euint32 encPrecedentScore;
        MockFHE.euint32 encTimelinessScore;
        bytes32 ipfsCidHash;
        uint256 timestamp;
        address submitter;
    }

    mapping(bytes32 => PracticeAttempt) public attempts;

    event AttemptSubmitted(bytes32 indexed caseId, address indexed submitter, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(STUDENT_ROLE, admin);
    }

    function submitAttempt(
        bytes32 caseId,
        MockFHE.euint32 encArgumentScore,
        MockFHE.euint32 encPrecedentScore,
        MockFHE.euint32 encTimelinessScore,
        bytes32 ipfsCidHash,
        bytes32 permitHash
    ) external onlyRole(STUDENT_ROLE) nonReentrant returns (bytes32 resultHandle) {
        permitHash;
        MockFHE.euint32 weightedArgument = MockFHE.mul(encArgumentScore, MockFHE.asEuint32(2));
        MockFHE.euint32 weightedPrecedent = MockFHE.mul(encPrecedentScore, MockFHE.asEuint32(3));
        MockFHE.euint32 weightedTime = MockFHE.mul(encTimelinessScore, MockFHE.asEuint32(1));

        MockFHE.euint32 total = MockFHE.add(weightedArgument, weightedPrecedent);
        total = MockFHE.add(total, weightedTime);
        MockFHE.euint32 clamped = MockFHE.min(total, MockFHE.asEuint32(100));

        attempts[caseId] = PracticeAttempt({
            encTotalScore: clamped,
            encArgumentScore: encArgumentScore,
            encPrecedentScore: encPrecedentScore,
            encTimelinessScore: encTimelinessScore,
            ipfsCidHash: ipfsCidHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        MockFHE.allowThis(clamped);
        MockFHE.allowSender(clamped);

        emit AttemptSubmitted(caseId, msg.sender, block.timestamp);
        return bytes32(MockFHE.euint32.unwrap(clamped));
    }

    function getAttemptPlain(bytes32 caseId)
        external
        view
        returns (uint256 totalScore, uint256 timestamp, bytes32 cidHash, address submitter)
    {
        PracticeAttempt storage attempt = attempts[caseId];
        totalScore = MockFHE.euint32.unwrap(attempt.encTotalScore);
        timestamp = attempt.timestamp;
        cidHash = attempt.ipfsCidHash;
        submitter = attempt.submitter;
    }
}
