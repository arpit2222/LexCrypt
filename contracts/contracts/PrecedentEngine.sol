// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MockFHE.sol";

contract PrecedentEngine is AccessControl, ReentrancyGuard {
    using MockFHE for *;

    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    struct PrecedentRecord {
        MockFHE.euint32 encCaseTypeCode;
        MockFHE.euint32 encJurisdiction;
        bytes32 ipfsCidHash;
        address submitter;
    }

    mapping(bytes32 => PrecedentRecord) public precedents;
    bytes32[] public precedentIds;
    mapping(bytes32 => MockFHE.euint32) private matchCounts;

    event PrecedentAdded(bytes32 indexed precedentId, uint256 timestamp);
    event SearchExecuted(bytes32 indexed queryId, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AUDITOR_ROLE, admin);
    }

    function addPrecedent(
        bytes32 precedentId,
        MockFHE.euint32 encCaseTypeCode,
        MockFHE.euint32 encJurisdiction,
        bytes32 ipfsCidHash
    ) external onlyRole(AUDITOR_ROLE) nonReentrant {
        precedents[precedentId] = PrecedentRecord({
            encCaseTypeCode: encCaseTypeCode,
            encJurisdiction: encJurisdiction,
            ipfsCidHash: ipfsCidHash,
            submitter: msg.sender
        });
        precedentIds.push(precedentId);

        MockFHE.allowThis(encCaseTypeCode);
        MockFHE.allowThis(encJurisdiction);

        emit PrecedentAdded(precedentId, block.timestamp);
    }

    function searchPrecedents(
        bytes32 queryId,
        MockFHE.euint32 encCaseTypeCode,
        MockFHE.euint32 encJurisdiction,
        bytes32 permitHash
    ) external nonReentrant returns (bytes32 resultHandle) {
        permitHash;
        MockFHE.euint32 count = MockFHE.asEuint32(0);

        for (uint256 i = 0; i < precedentIds.length; i++) {
            PrecedentRecord storage record = precedents[precedentIds[i]];
            MockFHE.ebool matchType = MockFHE.eq(record.encCaseTypeCode, encCaseTypeCode);
            MockFHE.ebool matchJur = MockFHE.eq(record.encJurisdiction, encJurisdiction);
            MockFHE.ebool both = MockFHE.and(matchType, matchJur);
            MockFHE.euint32 increment = MockFHE.select(both, MockFHE.asEuint32(1), MockFHE.asEuint32(0));
            count = MockFHE.add(count, increment);
        }

        matchCounts[queryId] = count;

        MockFHE.allowThis(count);
        MockFHE.allowSender(count);

        emit SearchExecuted(queryId, block.timestamp);
        return bytes32(MockFHE.euint32.unwrap(count));
    }

    function getMatchCountPlain(bytes32 queryId) external view returns (uint256 count) {
        count = MockFHE.euint32.unwrap(matchCounts[queryId]);
    }

    function totalPrecedents() external view returns (uint256) {
        return precedentIds.length;
    }
}
