// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./MockFHE.sol";

contract LexCryptRegistry is AccessControl {
    using MockFHE for *;

    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    address public judgeAssistant;
    address public practiceArena;
    address public winPredictor;
    address public precedentEngine;
    address public evidenceVault;

    struct EncryptedCase {
        MockFHE.euint128 caseDataHash;
        MockFHE.euint32 caseTypeCode;
        MockFHE.euint32 jurisdictionCode;
        MockFHE.euint32 filedTimestamp;
        MockFHE.euint32 sensitivityLevel;
        bytes32 ipfsRef;
        address submitter;
        bool analysisComplete;
    }

    mapping(bytes32 => EncryptedCase) public cases;
    mapping(address => bytes32[]) public judgeCaseHistory;

    event CaseSubmitted(bytes32 indexed caseId, address indexed judge, uint256 timestamp);
    event AnalysisComplete(bytes32 indexed caseId, uint256 timestamp);
    event EvidenceCommitted(bytes32 indexed evidenceHash, address indexed submitter);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function setModules(
        address _judgeAssistant,
        address _practiceArena,
        address _winPredictor,
        address _precedentEngine,
        address _evidenceVault
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        judgeAssistant = _judgeAssistant;
        practiceArena = _practiceArena;
        winPredictor = _winPredictor;
        precedentEngine = _precedentEngine;
        evidenceVault = _evidenceVault;
    }

    function submitCase(
        bytes32 caseId,
        MockFHE.euint128 caseDataHash,
        MockFHE.euint32 caseTypeCode,
        MockFHE.euint32 jurisdictionCode,
        MockFHE.euint32 filedTimestamp,
        MockFHE.euint32 sensitivityLevel,
        bytes32 ipfsRef
    ) external onlyRole(JUDGE_ROLE) {
        EncryptedCase storage entry = cases[caseId];
        entry.caseDataHash = caseDataHash;
        entry.caseTypeCode = caseTypeCode;
        entry.jurisdictionCode = jurisdictionCode;
        entry.filedTimestamp = filedTimestamp;
        entry.sensitivityLevel = sensitivityLevel;
        entry.ipfsRef = ipfsRef;
        entry.submitter = msg.sender;
        entry.analysisComplete = false;

        MockFHE.allowThis(caseDataHash);
        MockFHE.allowThis(caseTypeCode);
        MockFHE.allowThis(jurisdictionCode);
        MockFHE.allowThis(filedTimestamp);
        MockFHE.allowThis(sensitivityLevel);

        judgeCaseHistory[msg.sender].push(caseId);
        emit CaseSubmitted(caseId, msg.sender, block.timestamp);
    }

    function markAnalysisComplete(bytes32 caseId) external {
        require(
            msg.sender == judgeAssistant || msg.sender == winPredictor,
            "Unauthorized"
        );
        cases[caseId].analysisComplete = true;
        emit AnalysisComplete(caseId, block.timestamp);
    }

    function commitEvidence(bytes32 evidenceHash) external {
        emit EvidenceCommitted(evidenceHash, msg.sender);
    }
}
